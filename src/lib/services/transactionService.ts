/**
 * Transaction Service
 * 
 * This service handles NFT transactions including buying, selling,
 * and tracking transaction history.
 */

import { v4 as uuidv4 } from 'uuid';
import { calculatePrice, isThresholdReached, calculatePlatformFee } from './bondingCurveService';
import { updateRealSolBalance, updateSyntheticSolBalance } from './walletService';

// Types
export type TransactionType = 'BUY' | 'SELL' | 'MINT';

export interface Transaction {
  id: string;
  nftId: string;
  collectionId: string;
  buyer: string;
  seller: string | null;
  price: number;
  timestamp: Date;
  transactionType: TransactionType;
}

/**
 * Create transaction record
 * @param nftId NFT ID
 * @param collectionId Collection ID
 * @param buyer Buyer wallet address
 * @param seller Seller wallet address (null for minting)
 * @param price Transaction price
 * @param transactionType Transaction type
 * @returns Transaction object
 */
export function createTransaction(
  nftId: string,
  collectionId: string,
  buyer: string,
  seller: string | null,
  price: number,
  transactionType: TransactionType
): Transaction {
  return {
    id: uuidv4(),
    nftId,
    collectionId,
    buyer,
    seller,
    price,
    timestamp: new Date(),
    transactionType
  };
}

/**
 * Process NFT purchase
 * @param nftId NFT ID
 * @param collectionId Collection ID
 * @param buyer Buyer wallet address
 * @param seller Seller wallet address
 * @param currentMarketCap Current market cap
 * @param basePrice Base price
 * @param growthFactor Growth factor
 * @returns Transaction object or null if failed
 */
export function processNFTPurchase(
  nftId: string,
  collectionId: string,
  buyer: string,
  seller: string,
  currentMarketCap: number,
  basePrice: number,
  growthFactor: number = 0.00003606
): Transaction | null {
  // Calculate price based on bonding curve
  const price = calculatePrice(currentMarketCap, basePrice, growthFactor);
  
  // Check if threshold is reached
  const thresholdReached = isThresholdReached(currentMarketCap);
  
  // Process payment
  // In a real implementation, this would handle actual SOL transfers
  // For simulation, we just create the transaction
  
  // Calculate platform fee
  const platformFee = calculatePlatformFee(price);
  const sellerAmount = price - platformFee;
  
  // Update balances
  updateRealSolBalance(buyer, -price);
  
  if (thresholdReached) {
    // In threshold reached state, seller gets synthetic SOL
    updateSyntheticSolBalance(seller, collectionId, sellerAmount);
  } else {
    // Pre-threshold, seller gets real SOL
    updateRealSolBalance(seller, sellerAmount);
  }
  
  // Create transaction record
  return createTransaction(
    nftId,
    collectionId,
    buyer,
    seller,
    price,
    'BUY'
  );
}

/**
 * Process NFT minting (first sale)
 * @param nftId NFT ID
 * @param collectionId Collection ID
 * @param buyer Buyer wallet address
 * @param creator Creator wallet address
 * @param basePrice Base price
 * @returns Transaction object or null if failed
 */
export function processNFTMinting(
  nftId: string,
  collectionId: string,
  buyer: string,
  creator: string,
  basePrice: number
): Transaction | null {
  // For first sale, price is just the base price
  const price = basePrice;
  
  // Process payment
  // In a real implementation, this would handle actual SOL transfers
  // For simulation, we just create the transaction
  
  // Creator gets a reward
  updateRealSolBalance(creator, 0.5); // 0.5 SOL creator reward
  
  // First buyer pays 0.02 SOL fee
  updateRealSolBalance(buyer, -(price + 0.02));
  
  // Create transaction record
  return createTransaction(
    nftId,
    collectionId,
    buyer,
    null, // No seller for minting
    price,
    'MINT'
  );
}

/**
 * Get transaction history for NFT
 * @param nftId NFT ID
 * @returns Array of transactions
 */
export function getNFTTransactionHistory(nftId: string): Transaction[] {
  // In a real implementation, this would query the database
  // For simulation, we return mock transactions
  
  const mockTransactions: Transaction[] = [];
  
  // Generate some random transactions
  const transactionCount = Math.floor(Math.random() * 5) + 1;
  
  for (let i = 0; i < transactionCount; i++) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - i);
    
    mockTransactions.push({
      id: uuidv4(),
      nftId,
      collectionId: `col_${nftId.substring(0, 4)}`,
      buyer: `buyer${i}`,
      seller: i === 0 ? null : `seller${i}`,
      price: parseFloat((Math.random() * 5).toFixed(2)),
      timestamp,
      transactionType: i === 0 ? 'MINT' : 'BUY'
    });
  }
  
  return mockTransactions.sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
}
