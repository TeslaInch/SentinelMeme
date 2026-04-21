import { TokenData, HolderData, LiquidityData, RiskReport } from './types';

export async function analyzeRisk(
  token: TokenData,
  holders: HolderData,
  liquidity: LiquidityData
): Promise<RiskReport> {
  // STEP 1 — Rule-based pre-screening
  const preliminaryFlags: string[] = [];
  const now = Date.now() / 1000;

  if (holders.largestHolderPercent > 50) {
    preliminaryFlags.push('Single wallet controls over 50% of supply');
  }

  if (holders.largestHolderPercent > 80) {
    preliminaryFlags.push('EXTREME: Single wallet controls over 80% of supply');
  }

  if (holders.top10HoldersPercent > 90) {
    preliminaryFlags.push('Top 10 wallets control over 90% of supply — extreme concentration');
  }

  if (liquidity.liquidityUSD < 1000) {
    preliminaryFlags.push('Liquidity below $1,000 — extremely illiquid');
  }

  if (liquidity.isLiquidityLocked === false) {
    preliminaryFlags.push('Liquidity is NOT locked — developer can rug at any time');
  }

  if (token.contractVerified === false) {
    preliminaryFlags.push('Contract source code is NOT verified on BSCScan');
  }

  if (token.deployedAt > 0 && now - token.deployedAt < 3600) {
    preliminaryFlags.push('Token is less than 1 hour old — extremely early');
  }

  // STEP 2 — Build the AI prompt
  const userPrompt = `
Analyze this BNB Chain meme token:

Token Name: ${token.name}
Token Symbol: ${token.symbol}
Token Address: ${token.address}
Total Supply: ${token.totalSupply}
Contract Verified: ${token.contractVerified}
Deployed At: ${token.deployedAt} (unix timestamp)

Holder Concentration:
- Total Holders: ${holders.totalHolders}
- Largest Holder Percent: ${holders.largestHolderPercent}%
- Top 10 Holders Percent: ${holders.top10HoldersPercent}%

Liquidity:
- Has Liquidity: ${liquidity.hasLiquidity}
- Liquidity USD: $${liquidity.liquidityUSD}
- Liquidity Locked: ${liquidity.isLiquidityLocked}

Preliminary Flags Detected:
${preliminaryFlags.length > 0 ? preliminaryFlags.map(f => `- ${f}`).join('\n') : 'None'}

Return ONLY a valid JSON object with these fields:
  riskScore: number (0-100, where 100 = extreme danger)
  verdict: "SAFE" | "CAUTION" | "DANGER" | "CRITICAL"
  redFlags: string[] (max 5 items, plain English descriptions)
  greenFlags: string[] (max 3 items, plain English descriptions)
  summary: string (exactly 2 sentences, plain English)
`;

  const systemInstruction = 'You are a crypto security analyst specializing in meme token rug pull detection on BNB Chain. Analyze the provided token data and return ONLY a valid JSON object with no markdown, no code blocks, no explanation. Return raw JSON only with these exact fields: riskScore (number 0-100), verdict (SAFE|CAUTION|DANGER|CRITICAL), redFlags (array of strings, max 5), greenFlags (array of strings, max 3), summary (string, exactly 2 sentences).'

  // STEP 3 — Call the AI
  let rawText = ''
  let aiResult = null

  try {
    if (!process.env.DGRID_API_KEY) {
      console.error('[dGrid] DGRID_API_KEY not set')
      throw new Error('DGRID_API_KEY not configured')
    }

    console.log('[dGrid] Sending risk analysis request...')

    const response = await fetch('https://api.dgrid.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.1,
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[dGrid Error] HTTP', response.status, errText.slice(0, 200))
      throw new Error(`dGrid HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log('[dGrid raw]', JSON.stringify(data).slice(0, 300))

    const rawText = data?.choices?.[0]?.message?.content || ''

    if (!rawText) {
      console.error('[dGrid] Empty response')
      throw new Error('dGrid returned empty response')
    }

    const cleanText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    console.log('[dGrid cleaned]', cleanText.slice(0, 300))

    aiResult = JSON.parse(cleanText)

  } catch (error: any) {
    console.error('[dGrid Error]', error.message)
    console.log('[dGrid raw text was]', rawText.slice(0, 300))
    // Use fallback — do NOT crash the whole scan
    aiResult = {
      riskScore: 50,
      verdict: 'CAUTION',
      redFlags: ['AI analysis temporarily unavailable — manual review recommended'],
      greenFlags: [],
      summary: 'Automated AI analysis could not be completed for this token. Review the raw data carefully before investing.'
    }
  }

  // Validate the aiResult has the shape we expect — fill in missing fields
  const safeResult = {
    riskScore: typeof aiResult.riskScore === 'number' ? aiResult.riskScore : 50,
    verdict: ['SAFE','CAUTION','DANGER','CRITICAL'].includes(aiResult.verdict) ? aiResult.verdict : 'CAUTION',
    redFlags: Array.isArray(aiResult.redFlags) ? aiResult.redFlags : [],
    greenFlags: Array.isArray(aiResult.greenFlags) ? aiResult.greenFlags : [],
    summary: typeof aiResult.summary === 'string' ? aiResult.summary : 'Analysis incomplete.',
  }

  // STEP 4 — Return the full RiskReport
  return {
    tokenAddress: token.address,
    tokenName: token.name,
    tokenSymbol: token.symbol,
    riskScore: safeResult.riskScore,
    verdict: safeResult.verdict,
    redFlags: safeResult.redFlags,
    greenFlags: safeResult.greenFlags,
    summary: safeResult.summary,
    scannedAt: Date.now(),
    rawData: {
      token,
      holders,
      liquidity,
    },
  };
}
