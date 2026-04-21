import { RiskReport } from './types'

export async function sendTelegramAlert(report: RiskReport): Promise<void> {

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Silently skip if bot is not configured
  if (!token || !chatId) {
    console.log('[Telegram] Bot not configured — set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local')
    return
  }

  // Only alert for serious verdicts
  if (!['DANGER', 'CRITICAL'].includes(report.verdict)) {
    console.log('[Telegram] Verdict:', report.verdict, '— below alert threshold, skipping')
    return
  }

  const flags = report.redFlags.slice(0, 3).map(f => `⚠ ${f}`).join('\n')
  const scoreBar = '█'.repeat(Math.round(report.riskScore / 10)) + 
                   '░'.repeat(10 - Math.round(report.riskScore / 10))
  const emoji = report.verdict === 'CRITICAL' ? '💀' : '🔴'

  const message = `${emoji} ${report.verdict} — SENTINELMEME ALERT

Token: ${report.tokenName} (${report.tokenSymbol})
Risk Score: ${scoreBar} ${report.riskScore}/100
Contract: ${report.tokenAddress}

Red Flags:
${flags}

AI Assessment:
${report.summary}

BSCScan: https://bscscan.com/token/${report.tokenAddress}
Chart: https://dexscreener.com/bsc/${report.tokenAddress}

Scanned: ${new Date(report.scannedAt).toUTCString()}
SentinelMeme | Four.Meme AI Sprint 2026`

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          disable_web_page_preview: true,
        }),
      }
    )

    const data = await response.json()

    if (data.ok) {
      console.log('[Telegram] ✅ Alert sent —', report.tokenName, report.verdict)
    } else {
      console.error('[Telegram] Failed:', data.description)
    }
  } catch (error: any) {
    console.error('[Telegram] Network error:', error.message)
  }
}

