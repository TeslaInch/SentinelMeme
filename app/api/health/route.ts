export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'SentinelMeme',
    timestamp: new Date().toISOString(),
    telegramActive: !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  });
}
