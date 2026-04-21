export async function GET() {
  const results: Record<string, any> = {}

  // Test Moralis
  try {
    const res = await fetch(
      'https://deep-index.moralis.io/api/v2.2/erc20/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82/price?chain=0x38',
      {
        headers: {
          'X-API-Key': process.env.MORALIS_API_KEY || '',
        }
      }
    )
    const data = await res.json()
    results.moralis = data.usdPrice
      ? `✅ WORKING — CAKE price: $${parseFloat(data.usdPrice).toFixed(2)}` 
      : `❌ FAILED: ${JSON.stringify(data)}` 
  } catch (e: any) {
    results.moralis = `❌ ERROR: ${e.message}` 
  }

  // Test DexScreener (no key needed)
  try {
    const res = await fetch(
      'https://api.dexscreener.com/latest/dex/tokens/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    )
    const data = await res.json()
    const pair = data?.pairs?.[0]
    results.dexscreener = pair
      ? `✅ WORKING — ${pair.baseToken?.symbol} liquidity: $${pair.liquidity?.usd?.toLocaleString()}` 
      : `❌ No pairs found` 
  } catch (e: any) {
    results.dexscreener = `❌ ERROR: ${e.message}` 
  }

  // Test BSC RPC
  try {
    const res = await fetch(process.env.BSC_RPC_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
    })
    const data = await res.json()
    results.bsc_rpc = data.result
      ? `✅ WORKING — block ${parseInt(data.result, 16)}` 
      : `❌ FAILED: ${JSON.stringify(data)}` 
  } catch (e: any) {
    results.bsc_rpc = `❌ ERROR: ${e.message}` 
  }

  // Test dGrid
  try {
    const res = await fetch('https://api.dgrid.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: 'say ok' }],
        max_tokens: 5,
        temperature: 0,
      })
    })
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    results.dgrid = text
      ? `✅ WORKING — response: "${text.trim()}"` 
      : `❌ FAILED: ${JSON.stringify(data).slice(0, 200)}` 
  } catch (e: any) {
    results.dgrid = `❌ ERROR: ${e.message}` 
  }

  // Test Telegram
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe` 
    )
    const data = await res.json()
    results.telegram = data.ok
      ? `✅ WORKING — bot: @${data.result.username}` 
      : `❌ FAILED: ${data.description}` 
  } catch (e: any) {
    results.telegram = `❌ ERROR: ${e.message}` 
  }

  // Show which env vars are loaded (never show full values)
  results.env_check = {
    MORALIS_API_KEY: process.env.MORALIS_API_KEY
      ? `SET (starts: ${process.env.MORALIS_API_KEY.slice(0, 8)}...)` 
      : 'NOT SET ❌',
    DGRID_API_KEY: process.env.DGRID_API_KEY
      ? `SET (starts: ${process.env.DGRID_API_KEY.slice(0, 8)}...)` 
      : 'NOT SET ❌',
    BSC_RPC_URL: process.env.BSC_RPC_URL
      ? `SET — ${process.env.BSC_RPC_URL}` 
      : 'NOT SET ❌',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN
      ? `SET (starts: ${process.env.TELEGRAM_BOT_TOKEN.slice(0, 8)}...)` 
      : 'NOT SET ❌',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID
      ? `SET — ${process.env.TELEGRAM_CHAT_ID}` 
      : 'NOT SET ❌',
  }

  return Response.json(results)
}
