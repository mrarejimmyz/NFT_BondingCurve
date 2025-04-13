# Pump.fun NFT Platform Architecture

## Overview
The pump.fun platform is an NFT marketplace built on a bonding curve mechanism, allowing users to trade NFTs with dynamically calculated prices based on market capitalization. The platform features a dual currency system (real and synthetic SOL) and integrates with IPFS for NFT metadata storage.

## Core Components

### 1. Frontend Architecture
- **Layout Components**
  - Header (Navigation, Wallet Connection)
  - Footer
  - Main Content Area
  - Sidebar (Collection Info, Market Stats)

- **Page Components**
  - Home/Discovery Page
  - Collection Details Page
  - NFT Creation Page
  - User Dashboard
  - Transaction History

- **Functional Components**
  - Wallet Connector (Phantom/Backpack)
  - Bonding Curve Visualizer (D3.js)
  - NFT Card/Grid Display
  - Transaction Modal
  - Price Calculator

### 2. Backend Architecture (Simulated)

- **API Routes**
  - `/api/collections` - CRUD operations for NFT collections
  - `/api/nfts` - CRUD operations for individual NFTs
  - `/api/transactions` - Handle buy/sell transactions
  - `/api/users` - User account management
  - `/api/market` - Market statistics and price data

- **Service Layer**
  - BondingCurveService - Calculate prices based on market cap
  - NFTService - Handle NFT metadata and storage
  - WalletService - Manage wallet connections and balances
  - TransactionService - Process buy/sell operations
  - MarketService - Track market statistics

### 3. Data Models

#### Collection
```typescript
interface Collection {
  id: string;
  name: string;
  description: string;
  creator: string;
  metadataUri: string;
  bondingCurve: {
    basePrice: number;
    growthFactor: number;
  };
  marketCap: number;
  thresholdReached: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### NFT
```typescript
interface NFT {
  id: string;
  collectionId: string;
  name: string;
  description: string;
  imageUri: string;
  metadataUri: string;
  owner: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}
```

#### Transaction
```typescript
interface Transaction {
  id: string;
  nftId: string;
  collectionId: string;
  buyer: string;
  seller: string;
  price: number;
  timestamp: Date;
  transactionType: 'BUY' | 'SELL' | 'MINT';
}
```

#### User
```typescript
interface User {
  id: string;
  walletAddress: string;
  realSolBalance: number;
  syntheticSolBalances: Record<string, number>; // collectionId -> balance
  joinedAt: Date;
}
```

### 4. Database Schema (D1)

```sql
-- Collections Table
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator TEXT NOT NULL,
  metadata_uri TEXT NOT NULL,
  base_price REAL NOT NULL,
  growth_factor REAL NOT NULL,
  market_cap REAL NOT NULL DEFAULT 0,
  threshold_reached INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- NFTs Table
CREATE TABLE nfts (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_uri TEXT NOT NULL,
  metadata_uri TEXT NOT NULL,
  owner TEXT NOT NULL,
  price REAL NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES collections(id)
);

-- NFT Attributes Table
CREATE TABLE nft_attributes (
  id TEXT PRIMARY KEY,
  nft_id TEXT NOT NULL,
  trait_type TEXT NOT NULL,
  value TEXT NOT NULL,
  FOREIGN KEY (nft_id) REFERENCES nfts(id)
);

-- Transactions Table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  nft_id TEXT NOT NULL,
  collection_id TEXT NOT NULL,
  buyer TEXT NOT NULL,
  seller TEXT,
  price REAL NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  transaction_type TEXT NOT NULL,
  FOREIGN KEY (nft_id) REFERENCES nfts(id),
  FOREIGN KEY (collection_id) REFERENCES collections(id)
);

-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  real_sol_balance REAL NOT NULL DEFAULT 0,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Synthetic SOL Balances Table
CREATE TABLE synthetic_sol_balances (
  user_id TEXT NOT NULL,
  collection_id TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, collection_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (collection_id) REFERENCES collections(id)
);
```

## 5. Bonding Curve Implementation

The bonding curve mechanism will be implemented as a JavaScript service that calculates prices based on the formula:

```javascript
function calculatePrice(currentMarketCap, basePrice, growthFactor = 0.00003606) {
  return basePrice * Math.exp(growthFactor * currentMarketCap);
}
```

Key features:
- Dynamic price calculation based on market cap
- Threshold detection at $69k market cap
- Price history tracking for visualization

## 6. Dual Currency System

The platform will simulate the dual currency system:

- **Real SOL**:
  - Tracked in user balances
  - 98% held in simulated escrow
  - 2% platform fee on transactions

- **Synthetic SOL**:
  - Collection-specific balances
  - Convertible 1:1 with real SOL pre-threshold
  - Tracked in the synthetic_sol_balances table

## 7. NFT Metadata Infrastructure

The platform will simulate IPFS integration:

- Metadata generation in standard format
- Image storage simulation
- On-chain storage simulation via Metaplex format

## 8. Data Flow

1. User connects wallet
2. User browses/creates NFT collections
3. When purchasing an NFT:
   - Price is calculated based on bonding curve
   - Transaction is recorded
   - Balances are updated
   - Market cap is increased
4. When selling an NFT:
   - Pre-threshold: Direct conversion to real SOL
   - Post-threshold: Liquidity pool simulation

## 9. Security Considerations

- Input validation on all API endpoints
- Rate limiting for API requests
- Simulated transaction signing
- Error handling and logging
