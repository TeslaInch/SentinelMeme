import { sendTelegramAlert } from '@/lib/telegram'

export async function GET() {
  const mockReport = {
    tokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    tokenName: 'SentinelMeme Test',
    tokenSymbol: 'TEST',
    riskScore: 95,
    verdict: 'CRITICAL' as const,
    redFlags: [
      'Single wallet controls 91% of supply',
      'Liquidity is NOT locked',
      'Contract is not verified on BSCScan',
    ],
    greenFlags: [],
    summary: 'This is a test alert from SentinelMeme. Your Telegram bot is correctly configured and working.',
    scannedAt: Date.now(),
    rawData: {
      token: { address: '0x1234...', name: 'Test', symbol: 'TEST', totalSupply: '1000000', deployedAt: 0, contractVerified: false },
      holders: { totalHolders: 5, top10HoldersPercent: 99, largestHolderPercent: 91 },
      liquidity: { hasLiquidity: false, liquidityUSD: 0, isLiquidityLocked: false },
    }
  }

  await sendTelegramAlert(mockReport)

  return Response.json({
    message: 'Test alert fired. Check your Telegram.',
    botConfigured: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    verdict: mockReport.verdict,
    tokenName: mockReport.tokenName,
  })
}
