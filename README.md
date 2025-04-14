# BondingCurve NFT Platform - Solana & Tensor Integration

## Platform Overview

BondingCurve is an advanced NFT creation and trading platform built on Solana that combines mathematical price discovery with automated liquidity. The platform implements a unique dual-currency system where NFTs start with an internal bonding curve mechanism and can "graduate" to the Tensor marketplace ecosystem when reaching sufficient market adoption.

![Platform Architecture]

### Smart Contract Architecture

The platform consists of four main contract modules:

**NFT Creator Contract (`nft_creator.rs`)**

- Manages collection creation with IPFS-backed metadata
- Implements Metaplex-compatible NFT minting
- Enforces royalty distributions (configurable up to 10%)
- Handles the dual currency system (real/synthetic SOL)

**Bonding Curve Engine (`bonding_curve_engine.rs`)**

- Implements modified exponential curve: `price = basePrice * exp(0.00003606 * marketCap)`
- Dynamic price calculation based on real-time collection metrics
- Supports step-based price intervals for predictable growth

**Liquidity Bridge (`liquidity_bridge.rs`)**

- Manages threshold detection ($69k market cap)
- Creates liquidity pools upon threshold activation
- Handles gradual DEX liquidity injection (10% per hour)

**Tensor Integration Module (`tensor_bridge.rs`)**

- **NEW!** Provides seamless migration to Tensor marketplace
- Integrated analytics, trait-based bidding, and AMM pools
- Enables "graduated" collections to access Tensor's advanced trading features

## Key Features

### Innovative Bonding Curve Mechanism

```rust
// Price calculation with configurable bonding curve
pub fn calculate_price(&self, current_market_cap: u64, base_price: u64) -> u64 {
    // Modified exponential formula based on mint.club implementation
    base_price.saturating_mul(
        self.fixed_point_exp(
            self.growth_factor.saturating_mul(current_market_cap)
        )
    )
}
```

- Initial price discovery without external liquidity
- Predictable price appreciation as collection gains adoption
- Protection against market manipulation with gradual price steps

### Dual Currency System

- **Pre-threshold**: Users can withdraw real SOL minus fees
- **Post-threshold**: System transitions to synthetic SOL internally
- Real SOL is used to create managed liquidity pools on DEXs

### Tensor Graduation System

When collections reach critical adoption metrics:

1. Collection undergoes "graduation verification"
2. Tensor Integration Module creates official collection page
3. NFTs become tradable with Tensor's advanced features:
   - Pro-level analytics dashboard
   - Trait/rarity-based bidding
   - Collection-wide floor sweeping
   - AMM-powered liquidity pools

### Fee Structure & Incentives

| Action               | Fee/Reward          | Recipient  |
| -------------------- | ------------------- | ---------- |
| Collection Creation  | Free                | -          |
| First NFT Purchase   | 0.02 SOL            | Platform   |
| NFT Transactions     | 1%                  | Platform   |
| Threshold Activation | 0.5 SOL reward      | Creator    |
| Tensor Graduation    | Enhanced visibility | Collection |

## Building and Deploying

### Prerequisites

- Solana CLI (v1.14.0+)
- Anchor Framework (0.29.0+)
- Rust (latest stable)
- Node.js (16+) for frontend integration

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/bondingcurve-nft-platform

# Install dependencies
cd bondingcurve-nft-platform
yarn install

# Build contracts
anchor build

# Run tests
anchor test

# Deploy to devnet
solana config set --url devnet
anchor deploy
```

### Mainnet Deployment

```bash
# Deploy to Solana mainnet
solana config set --url mainnet-beta
anchor deploy --provider.cluster mainnet
```

## Frontend Integration

The platform provides TypeScript/JavaScript SDKs for seamless integration:

```typescript
// Initialize BondingCurve client
import { BondingCurveClient } from "@bondingcurve/client";
const client = new BondingCurveClient(connection, wallet);

// Create collection
const collectionId = await client.createCollection({
  name: "My Awesome NFTs",
  symbol: "AWESOME",
  basePrice: 0.1, // SOL
  growthFactor: 0.00003606,
  ipfsMetadataUri: "ipfs://QmXyz...",
});

// Monitor collection status
const status = await client.getCollectionStatus(collectionId);
console.log(`Market Cap: ${status.marketCap}`);
console.log(`Graduated to Tensor: ${status.tensorGraduated}`);
```

## Tensor Integration Workflow

1. **Pre-Graduation Phase**

   - Collection operates within internal bonding curve
   - NFTs are tradable only on the BondingCurve platform
   - Market cap and trading volume are monitored

2. **Graduation Criteria**

   - Market cap reaches $69k threshold
   - Minimum of 100 unique holders
   - At least 10% of collection in active trading

3. **Tensor Migration Process**

   - Collection metadata is synchronized with Tensor API
   - Collection-wide floor analytics are established
   - Trading interface transitions to Tensor marketplace
   - Advanced trader features become available

4. **Post-Graduation Benefits**
   - Enhanced liquidity through Tensor's marketplace aggregation
   - Professional trading tools (price charts, floor sweeping)
   - Potential integration with TNSR token incentives
   - Expanded visibility to Tensor's trader community

## Security and Compliance

- All contracts audited by [Audit Partner]
- Royalty enforcement compliant with Metaplex standards
- Dual-currency system protected against manipulation
- Open-source code with transparent bonding curve parameters
- Insurance fund for early-stage collections

## License

This project is protected under the Innovation Protection License v2.0. All rights reserved unless explicitly granted. See LICENSE.md for details.
