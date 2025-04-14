# BondingCurve NFT Platform - Solana Contract Integration

This directory contains the Solana smart contracts for the BondingCurve NFT platform. These contracts implement the bonding curve mechanism, NFT creation and trading, and liquidity pool functionality as specified in the platform blueprint.

## Contract Overview

The platform consists of three main contracts:

1. **NFT Creator Contract** (`nft_creator.rs`)

   - Handles creation and management of NFT collections
   - Implements NFT minting and trading
   - Manages the dual currency system (real and synthetic SOL)
   - Enforces threshold detection at $69k market cap

2. **Bonding Curve Engine** (`bonding_curve_engine.rs`)

   - Implements the modified exponential curve for price calculation
   - Tracks market cap and threshold status
   - Provides price calculation services

3. **Liquidity Bridge** (`liquidity_bridge.rs`)
   - Manages liquidity pool creation post-threshold
   - Handles adding and removing liquidity
   - Integrates with DEX (simulated)

## Key Features

- **Bonding Curve Mechanism**: Implements the specified formula with growth factor 0.00003606
- **Threshold Activation**: Automatically detects when market cap reaches $69k
- **Dual Currency System**: Manages both real SOL and synthetic SOL balances
- **Fee Structure**: Implements platform fees (2%) and creator rewards (0.5 SOL)
- **Liquidity Pools**: Supports creation of liquidity pools post-threshold

## Building and Deploying

To build and deploy these contracts to the Solana blockchain:

1. Install the Solana CLI and Anchor framework
2. Set up a Solana wallet and fund it with SOL
3. Build the contracts:
   ```
   anchor build
   ```
4. Deploy to the desired network:
   ```
   anchor deploy --provider.cluster devnet
   ```

## Integration with Frontend

The frontend application interacts with these contracts through the Solana web3.js library. The key integration points are:

- Wallet connection for transaction signing
- Collection creation and NFT minting
- NFT buying and selling with dynamic pricing
- Viewing and managing synthetic SOL balances
- Liquidity pool interactions

## Testing

Before deploying to mainnet, thoroughly test the contracts on a local validator or devnet to ensure all functionality works as expected.
