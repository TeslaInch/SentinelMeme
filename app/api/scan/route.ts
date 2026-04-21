// Simple in-memory rate limiter
// Stores: IP -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5        // max requests
const RATE_WINDOW = 60000   // per 60 seconds per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true // allowed
  }
  
  if (record.count >= RATE_LIMIT) {
    return false // blocked
  }
  
  record.count++
  return true // allowed
}

import { getTokenData, getHolderData, getLiquidityData } from '@/lib/bscscan';
import { analyzeRisk } from '@/lib/riskEngine';
import { RiskReport } from '@/lib/types';
import { sendTelegramAlert } from '@/lib/telegram';
import { writeRiskAttestation, readRiskAttestation } from '@/lib/attestation';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') 
      || request.headers.get('x-real-ip') 
      || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: 'Too many requests. Please wait 60 seconds before scanning again.' },
        { status: 429 }
      )
    }

    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return Response.json(
        { error: 'Token address is required' }, 
        { status: 400 }
      )
    }

    // Trim whitespace and normalize
    const cleanAddress = address.trim().toLowerCase()

    // Must be valid EVM address format
    if (!/^0x[0-9a-f]{40}$/.test(cleanAddress)) {
      return Response.json(
        { error: 'Invalid address format. Must be a valid BNB Chain contract address.' },
        { status: 400 }
      )
    }

    // Block obvious test/zero addresses
    if (cleanAddress === '0x0000000000000000000000000000000000000000') {
      return Response.json(
        { error: 'Invalid address' },
        { status: 400 }
      )
    }

    // Check for existing on-chain attestation
    const existingAttestation = await readRiskAttestation(cleanAddress);

    const SCAN_TIMEOUT = 25000 // 25 seconds

    const scanPromise = async () => {
      const [token, holders, liquidity] = await Promise.all([
        getTokenData(cleanAddress),
        getHolderData(cleanAddress),
        getLiquidityData(cleanAddress),
      ])
      return analyzeRisk(token, holders, liquidity)
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Scan timeout')), SCAN_TIMEOUT)
    )

    const report = await Promise.race([scanPromise(), timeoutPromise])

    // Fire Telegram alert in background — does not block response
    sendTelegramAlert(report).catch((e) =>
      console.error('[Telegram] Uncaught error:', e.message)
    )

    // Fire attestation write in background — only for DANGER/CRITICAL
    writeRiskAttestation(report.tokenAddress, report.riskScore, report.verdict).catch(() => {})

    return Response.json({ ...report, existingAttestation }, { status: 200 });
  } catch (error: any) {
    console.error('Scan failed:', error);
    if (error.message === 'Scan timeout') {
      return Response.json(
        { error: 'Scan timed out. Please try again.' },
        { status: 500 }
      );
    }
    if (error.message === 'Token not found') {
      return Response.json(
        { error: 'Token not found on BNB Chain' },
        { status: 404 }
      );
    }
    return Response.json(
      { error: 'Scan failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ status: 'SentinelMeme scanner online' });
}
