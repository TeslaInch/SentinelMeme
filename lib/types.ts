export interface TokenData {
  address: string;
  name: string;
  symbol: string;
  totalSupply: string;
  deployedAt: number;
  contractVerified: boolean;
}

export interface HolderData {
  totalHolders: number;
  top10HoldersPercent: number;
  largestHolderPercent: number;
}

export interface LiquidityData {
  hasLiquidity: boolean;
  liquidityUSD: number;
  isLiquidityLocked: boolean;
}

export interface RiskReport {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  riskScore: number;
  verdict: "SAFE" | "CAUTION" | "DANGER" | "CRITICAL";
  redFlags: string[];
  greenFlags: string[];
  summary: string;
  scannedAt: number;
  rawData: {
    token: TokenData;
    holders: HolderData;
    liquidity: LiquidityData;
  };
  existingAttestation?: {
    riskScore: number;
    verdict: string;
    timestamp: number;
  } | null;
  attestationTxHash?: string | null;
}
