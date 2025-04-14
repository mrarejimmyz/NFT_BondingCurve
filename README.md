# BondingCurve NFT Platform

A decentralized NFT marketplace built on bonding curve mechanics for dynamic pricing.

## Overview

BondingCurve is an innovative NFT platform that implements bonding curve mechanics to create dynamic pricing for NFT collections. The platform features a dual currency system, threshold activation, and liquidity pool integration.

## Key Features

- **Bonding Curve Mechanism**: Modified exponential curve for dynamic NFT pricing
- **Threshold Activation**: Special mechanics activate at $69k market cap
- **Dual Currency System**: Real SOL and synthetic SOL with pre/post-threshold mechanics
- **NFT Metadata Infrastructure**: IPFS integration for decentralized storage
- **Liquidity Pools**: Automated DEX integration post-threshold

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, D3.js
- **Backend**: Next.js API routes, Cloudflare Workers
- **Blockchain**: Solana smart contracts (Anchor framework)
- **Storage**: IPFS for NFT metadata

## Smart Contracts

The platform includes three main Solana smart contracts:

1. **NFT Creator Contract**: Handles collection management and NFT minting/trading
2. **Bonding Curve Engine**: Implements the pricing formula with growth factor 0.00003606
3. **Liquidity Bridge**: Manages liquidity pools post-threshold

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Solana CLI (for contract deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pump-fun.git
cd pump-fun

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Docker

A Dockerfile is included for containerized deployment:

```bash
# Build the Docker image
docker build -t pump-fun .

# Run the container
docker run -p 3000:3000 pump-fun
```

## Fee Structure

- Creation: First buyer pays 0.02 SOL
- Creator reward: 0.5 SOL on first purchase
- Platform fee: 2% on all transactions
- Withdrawal: 2% pre-threshold

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
