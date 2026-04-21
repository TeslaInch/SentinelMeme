import Moralis from 'moralis'
import { TokenData, HolderData, LiquidityData } from './types'

const BSC_CHAIN = '0x38' // BNB Chain mainnet chainId in hex

let moralisStarted = false
let moralisStarting: Promise<void> | null = null

async function initMoralis() {
  if (moralisStarted) return
  if (moralisStarting) return moralisStarting
  
  moralisStarting = Moralis.start({ 
    apiKey: process.env.MORALIS_API_KEY 
  }).then(() => {
    moralisStarted = true
    moralisStarting = null
  })
  
  return moralisStarting
}

export async function getTokenData(address: string): Promise<TokenData> {
  try {
    await initMoralis()

    const response = await Moralis.EvmApi.token.getTokenMetadata({
      chain: BSC_CHAIN,
      addresses: [address],
    })

    const token = response.toJSON()[0]

    if (!token) {
      console.log('[Moralis] No token metadata found for', address)
      return {
        address,
        name: 'Unknown',
        symbol: 'UNKNOWN',
        totalSupply: '0',
        deployedAt: 0,
        contractVerified: false,
      }
    }

    return {
      address,
      name: token.name || 'Unknown',
      symbol: token.symbol || 'UNKNOWN',
      totalSupply: '0',
      deployedAt: 0,
      contractVerified: token.verified_contract || false,
    }
  } catch (error: any) {
    console.error('[Moralis Error] getTokenData:', error.message)
    return {
      address,
      name: 'Unknown',
      symbol: 'UNKNOWN',
      totalSupply: '0',
      deployedAt: 0,
      contractVerified: false,
    }
  }
}

export async function getHolderData(address: string): Promise<HolderData> {
  try {
    await initMoralis()

    const response = await Moralis.EvmApi.token.getTokenOwners({
      chain: BSC_CHAIN,
      tokenAddress: address,
      limit: 10,
    })

    const owners = response.toJSON().result || []

    if (owners.length === 0) {
      return { totalHolders: 0, top10HoldersPercent: 0, largestHolderPercent: 0 }
    }

    const totalSupply = 1

    const top10Total = owners.reduce((sum: number, o: any) => {
      return sum + parseFloat(o.balance || '0')
    }, 0)

    const largest = parseFloat(owners[0]?.balance || '0')

    return {
      totalHolders: owners.length,
      top10HoldersPercent: Math.min(100, Math.round((top10Total / totalSupply) * 100)),
      largestHolderPercent: Math.min(100, Math.round((largest / totalSupply) * 100)),
    }
  } catch (error: any) {
    console.error('[Moralis Error] getHolderData:', error.message)
    return { totalHolders: 0, top10HoldersPercent: 0, largestHolderPercent: 0 }
  }
}

export async function getLiquidityData(address: string): Promise<LiquidityData> {
  try {
    // Use DexScreener — completely free, no API key needed
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    const pairs = data?.pairs || []

    // Find the most liquid BSC pair
    const bscPairs = pairs.filter((p: any) => p.chainId === 'bsc')

    if (bscPairs.length === 0) {
      return { hasLiquidity: false, liquidityUSD: 0, isLiquidityLocked: false }
    }

    // Sort by liquidity descending, take the best pair
    bscPairs.sort((a: any, b: any) => 
      (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
    )

    const bestPair = bscPairs[0]
    const liquidityUSD = bestPair.liquidity?.usd || 0

    console.log('[DexScreener] Liquidity for', address, ':', liquidityUSD)

    return {
      hasLiquidity: liquidityUSD > 0,
      liquidityUSD,
      isLiquidityLocked: false, // DexScreener doesn't provide lock status
    }
  } catch (error: any) {
    console.error('[DexScreener Error]', error.message)
    return { hasLiquidity: false, liquidityUSD: 0, isLiquidityLocked: false }
  }
}
