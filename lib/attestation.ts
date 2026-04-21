import { ethers } from 'ethers'

// Deployed contract address on BSC testnet
// We will deploy this and update the address
const CONTRACT_ADDRESS = process.env.ATTESTATION_CONTRACT_ADDRESS || ''

const CONTRACT_ABI = [
  'function attest(address tokenAddress, uint8 riskScore, string calldata verdict) external',
  'function getAttestation(address tokenAddress) external view returns (tuple(address tokenAddress, uint8 riskScore, string verdict, uint256 timestamp, address attestedBy))',
  'function getTotalAttestations() external view returns (uint256)',
  'event RiskAttested(address indexed tokenAddress, uint8 riskScore, string verdict, uint256 timestamp)',
]

export async function writeRiskAttestation(
  tokenAddress: string,
  riskScore: number,
  verdict: string
): Promise<string | null> {
  try {
    if (!process.env.ATTESTATION_PRIVATE_KEY) {
      console.log('[Attestation] No private key configured — skipping on-chain write')
      return null
    }
    if (!CONTRACT_ADDRESS) {
      console.log('[Attestation] No contract address configured — skipping')
      return null
    }
    if (!['DANGER', 'CRITICAL'].includes(verdict)) {
      return null
    }

    // Use BSC testnet with RPC fallback
    const TESTNET_RPCS = [
      'https://bsc-testnet-rpc.publicnode.com',
      'https://bsc-testnet.blockpi.network/v1/rpc/public',
      'https://endpoints.omniatech.io/v1/bsc/testnet/public',
    ]

    let provider: ethers.JsonRpcProvider | null = null
    
    for (const rpc of TESTNET_RPCS) {
      try {
        const p = new ethers.JsonRpcProvider(rpc)
        // Test connection with a short timeout
        await Promise.race([
          p.getBlockNumber(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 3000)
          )
        ])
        provider = p
        console.log('[Attestation] Connected to RPC:', rpc)
        break
      } catch {
        console.log('[Attestation] RPC failed, trying next:', rpc)
      }
    }

    if (!provider) {
      throw new Error('All testnet RPCs failed')
    }

    const wallet = new ethers.Wallet(process.env.ATTESTATION_PRIVATE_KEY, provider)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)

    console.log('[Attestation] Writing risk verdict on-chain for', tokenAddress)

    const tx = await contract.attest(
      tokenAddress,
      Math.min(riskScore, 255), // uint8 max
      verdict
    )

    console.log('[Attestation] TX submitted:', tx.hash)
    const receipt = await tx.wait()
    console.log('[Attestation] ✅ Confirmed in block', receipt.blockNumber)

    return tx.hash

  } catch (error: any) {
    // Never crash the scan — attestation is additive
    console.error('[Attestation] Failed (non-blocking):', error.message)
    return null
  }
}

export async function readRiskAttestation(tokenAddress: string): Promise<{
  riskScore: number
  verdict: string
  timestamp: number
  txHash?: string
} | null> {
  try {
    if (!CONTRACT_ADDRESS) return null

    const TESTNET_RPCS = [
      'https://bsc-testnet-rpc.publicnode.com',
      'https://bsc-testnet.blockpi.network/v1/rpc/public',
      'https://endpoints.omniatech.io/v1/bsc/testnet/public',
    ]

    let provider: ethers.JsonRpcProvider | null = null
    
    for (const rpc of TESTNET_RPCS) {
      try {
        const p = new ethers.JsonRpcProvider(rpc)
        // Test connection with a short timeout
        await Promise.race([
          p.getBlockNumber(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('timeout')), 3000)
          )
        ])
        provider = p
        console.log('[Attestation] Connected to RPC:', rpc)
        break
      } catch {
        console.log('[Attestation] RPC failed, trying next:', rpc)
      }
    }

    if (!provider) {
      throw new Error('All testnet RPCs failed')
    }

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

    const result = await contract.getAttestation(tokenAddress)

    if (!result.timestamp || result.timestamp.toString() === '0') return null

    return {
      riskScore: Number(result.riskScore),
      verdict: result.verdict,
      timestamp: Number(result.timestamp) * 1000,
    }
  } catch {
    return null
  }
}
