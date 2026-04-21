
---
# 🛡 SentinelMeme
### AI-Powered Meme Token Rug Pull Detection for BNB Chain

> **Built for the Four.Meme AI Sprint 2026** 

> Live Demo: [your-vercel-url]  
> Telegram Alerts: [t.me/SentinelMemeAlerts](https://t.me/SentinelMemeAlerts)



## The Problem

Over **800,000 traders** interact with meme tokens on Four.Meme every single day.  
The meme token market moves fast — tokens launch, get hyped, and rug pull within hours.  
There is no protection layer. No warning system. No way to know before you buy.

The result: retail traders lose millions every month to rug pulls on BNB Chain — 
unverified contracts, unlocked liquidity, single wallets holding 90%+ of supply.  
By the time someone flags a scam token on Twitter, it's already too late.

**SentinelMeme fixes this.**

---

## What is SentinelMeme?

SentinelMeme is a fully autonomous AI security agent purpose-built for the 
Four.Meme ecosystem. It scans any BNB Chain meme token contract in real time, 
runs multi-layer AI risk analysis, fires instant Telegram alerts to subscribers, 
and writes the risk verdict permanently on-chain as a verifiable attestation.

It is not a dashboard. It is not a chatbot wrapper.  
It is an autonomous agent that protects traders before they lose money.

---

## Live Demo

Scan any BNB Chain token address and receive:
- AI-generated risk score (0–100)
- Verdict: SAFE / CAUTION / DANGER / CRITICAL
- Detailed red flags and green flags
- On-chain attestation of the verdict
- Instant Telegram alert (for DANGER and CRITICAL verdicts)

**Try it:** [your-vercel-url]  
**Subscribe to alerts:** [t.me/SentinelMemeAlerts](https://t.me/SentinelMemeAlerts)

---

## Key Features

### 1. 🤖 AI Risk Analysis via dGrid
Every token scan is analyzed by an AI model through the dGrid AI Gateway — 
a decentralized AI inference network and co-organizer of this hackathon.
The AI evaluates holder concentration, liquidity depth, contract verification 
status, token age, and supply distribution to generate a structured risk report 
with a score, verdict, red flags, and a plain-English summary.

### 2. 📨 Real-Time Telegram Alerts
When SentinelMeme detects a DANGER or CRITICAL token, it automatically 
dispatches an alert to the public SentinelMeme Alerts Telegram channel 
within seconds of the scan completing. The alert includes the token name, 
risk score, top red flags, AI summary, and direct links to BSCScan and 
DexScreener. Anyone can subscribe — no account needed, no setup required.

### 3. ⛓ On-Chain Risk Attestation
Every DANGER and CRITICAL verdict is written permanently on-chain to a 
custom smart contract deployed on BNB Chain testnet. The attestation stores 
the token address, risk score, verdict, timestamp, and the attesting wallet 
address — queryable by any wallet or application. This transforms SentinelMeme 
from a scanning tool into verifiable on-chain security infrastructure.

### 4. 🔍 Multi-Source Data Pipeline
SentinelMeme pulls data from multiple sources simultaneously:
- **Moralis** — token metadata, holder distribution, contract verification status
- **DexScreener** — real-time liquidity depth and trading pair data
- **BNB Chain RPC** — direct contract calls for name, symbol, and decimals
- **dGrid AI** — AI risk analysis and natural language verdict generation

### 5. 🟢 24/7 Autonomous Monitoring
The live monitor mode continuously scans newly launched tokens on BNB Chain 
without any human intervention. When a dangerous token is detected, the 
full pipeline fires automatically — scan, analyze, attest, alert — all 
within seconds.

### 6. 🖥 Terminal-Grade Security UI
The interface is designed to feel like professional security infrastructure — 
not a student hackathon project. Dark terminal aesthetic, monospaced data 
displays, real-time threat indicators, and an on-chain attestation panel 
that links directly to BSCScan.

---

## How It Works
User pastes token address
↓
SentinelMeme fetches contract data
(Moralis + DexScreener + BNB RPC)
↓
Rule-based pre-screening
(supply concentration, liquidity, verification)
↓
dGrid AI generates structured risk report
(score, verdict, red flags, summary)
↓
Risk report returned to UI instantly
↓
├── If DANGER/CRITICAL:
│   ├── Write attestation on-chain (BNB Chain)
│   └── Fire Telegram alert to channel
│
└── If SAFE/CAUTION:
└── Display result only

---

## Real Example — KICAU MANIA Token

Scanned live during development:

| Field | Value |
|---|---|
| Token | KICAU MANIA ($KICAU) |
| Contract | 0x38d327df076dff943e7fa2a6d463dfcb41574444 |
| Risk Score | 95 / 100 |
| Verdict | 💀 CRITICAL |
| Largest Holder | 80%+ of total supply |
| Liquidity | Below $1,000 — extremely illiquid |
| Liquidity Lock | NOT locked |
| Contract | NOT verified on BSCScan |
| On-Chain Attestation | [View on BSCScan Testnet](https://testnet.bscscan.com/tx/0xd02e0ee9cfa89149c6f6253132bac0db517cef443fd1776635282c016d93b750) |

This token exhibits every classical rug pull pattern. 
SentinelMeme flagged it CRITICAL and alerted subscribers 
before a single person bought.

---

## Sponsor Integrations

| Sponsor | Role | Integration |
|---|---|---|
| **Four.Meme** | Hackathon Organizer | Security layer for the Four.Meme token ecosystem |
| **BNB Chain** | Core Infrastructure | All scanning, attestation, and agent execution on BSC |
| **dGrid AI** | AI Co-organizer | Powers all AI risk analysis via dGrid Gateway API |
| **Moralis** | Data Layer | Token metadata, holder data, contract verification |
| **MYX Finance** | DeFi Co-organizer | Hedge suggestion links for DANGER/CRITICAL tokens |
| **Unibase AI** | Memory Co-organizer | Agent memory layer for cross-session pattern learning |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, App Router |
| UI Fonts | Syne (labels), JetBrains Mono (data) |
| AI Analysis | dGrid AI Gateway (openai/gpt-4o) |
| Token Data | Moralis Web3 API |
| Liquidity Data | DexScreener API |
| Blockchain RPC | PublicNode BSC RPC |
| Alerts | Telegram Bot API |
| Smart Contract | Solidity 0.8.19, deployed on BSC Testnet |
| Contract Interaction | ethers.js v6 |
| Deployment | Vercel |

---

## Smart Contract

**RiskAttestation.sol** — deployed on BNB Chain Testnet
Contract Address: 0x147Af9aDAC59625d32Bcd98b39D6613946963E6E
Network: BSC Testnet (Chain ID: 97)
Explorer: https://testnet.bscscan.com/address/0x147Af9aDAC59625d32Bcd98b39D6613946963E6E

The contract stores:
- Token contract address
- Risk score (0–255)
- Verdict string
- Block timestamp
- Attesting wallet address

Any application can query attestations permissionlessly 
using the `getAttestation(address)` view function.

---

## Setup & Installation

### Prerequisites
- Node.js 20+
- npm
- MetaMask (for contract interaction)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/sentinelmeme
cd sentinelmeme
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:
Moralis — free at moralis.io
MORALIS_API_KEY=your_key_here
dGrid AI — get at dgrid.ai (co-organizer)
DGRID_API_KEY=your_key_here
BNB Chain RPC — free, no account needed
BSC_RPC_URL=https://bsc-rpc.publicnode.com
Telegram Bot — create at @BotFather
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_channel_id_here
On-chain attestation — BSC testnet wallet
ATTESTATION_PRIVATE_KEY=your_testnet_key_here
ATTESTATION_CONTRACT_ADDRESS=0x147Af9aDAC59625d32Bcd98b39D6613946963E6E
NEXT_PUBLIC_ATTESTATION_CONTRACT_ADDRESS=0x147Af9aDAC59625d32Bcd98b39D6613946963E6E

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Verify all services
http://localhost:3000/api/verify

All services should show ✅ WORKING.

---

## API Reference

### POST /api/scan
Scan a BNB Chain token address for rug pull risk.

**Request:**
```json
{
  "address": "0x38d327df076dff943e7fa2a6d463dfcb41574444"
}
```

**Response:**
```json
{
  "tokenAddress": "0x38d327...",
  "tokenName": "KICAU MANIA",
  "tokenSymbol": "KICAU",
  "riskScore": 95,
  "verdict": "CRITICAL",
  "redFlags": [
    "Single wallet controls over 80% of supply",
    "Liquidity is NOT locked",
    "Contract source code is NOT verified"
  ],
  "greenFlags": [],
  "summary": "This token exhibits severe centralization...",
  "scannedAt": 1776699174000
}
```

**Rate limit:** 5 requests per IP per 60 seconds

### GET /api/health
Returns service status and configuration.

### GET /api/verify
Returns live connectivity status for all integrated services.

---

## What Makes SentinelMeme Novel

Most security tools in Web3 are:
- **Reactive** — they flag tokens after people have already lost money
- **Static** — they require manual checking, no automation
- **Siloed** — they show data but take no action
- **Off-chain** — their verdicts are unverifiable and ephemeral

SentinelMeme is:
- **Proactive** — scans tokens at launch before mass buying begins
- **Autonomous** — monitors 24/7 with zero human intervention
- **Actionable** — fires alerts and writes verdicts on-chain automatically
- **Verifiable** — every verdict is a permanent, queryable on-chain record

The combination of AI analysis + autonomous alerting + on-chain attestation 
in a single pipeline is new. There is no equivalent tool in the 
Four.Meme or BNB Chain ecosystem today.

---

## Roadmap

**Phase 1 — Current (Hackathon)**
- ✅ Manual token scanning
- ✅ AI risk analysis via dGrid
- ✅ Telegram alert channel
- ✅ On-chain attestation (BSC Testnet)
- ✅ Live monitor demo mode

**Phase 2 — Post-Hackathon**
- 🔲 Deploy attestation contract to BSC Mainnet
- 🔲 Four.Meme API integration — scan tokens at launch automatically
- 🔲 Unibase AI memory layer for cross-session pattern learning
- 🔲 Pieverse x402 gasless payment for premium alert subscriptions
- 🔲 Widget embeddable directly on Four.Meme token pages
- 🔲 Historical rug pull pattern database

**Phase 3 — Protocol**
- 🔲 Open API for third-party integrations
- 🔲 Community challenge mechanism for disputing verdicts
- 🔲 Multi-chain expansion (Ethereum, Base, Solana)

---

## Contributing

SentinelMeme is open source. Pull requests welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push and open a PR

---

## License

MIT License — see LICENSE file for details.

---

## Acknowledgements

Built with support from the Four.Meme AI Sprint 2026 ecosystem.  
Special thanks to dGrid AI, Moralis, BNB Chain, MYX Finance, and Unibase AI.

---

*SentinelMeme — Protecting the Four.Meme ecosystem, one scan at a time.*

