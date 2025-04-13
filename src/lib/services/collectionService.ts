/**
 * Collection Service
 * 
 * This service handles NFT collections including creation, retrieval,
 * and market cap tracking.
 */

import { v4 as uuidv4 } from 'uuid';
import { generateIPFSUri } from './nftService';

// Types
export interface Collection {
  id: string;
  name: string;
  description: string;
  creator: string;
  metadataUri: string;
  basePrice: number;
  growthFactor: number;
  marketCap: number;
  thresholdReached: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create new collection
 * @param name Collection name
 * @param description Collection description
 * @param creator Creator wallet address
 * @param basePrice Base price in SOL
 * @param growthFactor Growth factor (default: 0.00003606)
 * @returns Collection object
 */
export function createCollection(
  name: string,
  description: string,
  creator: string,
  basePrice: number,
  growthFactor: number = 0.00003606
): Collection {
  const id = uuidv4();
  const metadataUri = generateIPFSUri(JSON.stringify({
    name,
    description,
    creator
  }));
  
  return {
    id,
    name,
    description,
    creator,
    metadataUri,
    basePrice,
    growthFactor,
    marketCap: 0,
    thresholdReached: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

/**
 * Update collection market cap
 * @param collectionId Collection ID
 * @param amount Amount to add to market cap
 * @returns Updated market cap and threshold status
 */
export function updateCollectionMarketCap(
  collectionId: string,
  amount: number
): { marketCap: number, thresholdReached: boolean } {
  // In a real implementation, this would update the database
  // For simulation, we return mock updated values
  
  // Get mock collection
  const collection = getCollectionById(collectionId);
  
  if (!collection) {
    return { marketCap: 0, thresholdReached: false };
  }
  
  const newMarketCap = collection.marketCap + amount;
  const thresholdReached = newMarketCap >= 69000; // $69k threshold
  
  return { marketCap: newMarketCap, thresholdReached };
}

/**
 * Get collection by ID (simulated)
 * @param id Collection ID
 * @returns Collection object or null if not found
 */
export function getCollectionById(id: string): Collection | null {
  // In a real implementation, this would query the database
  // For simulation, we return a mock collection if ID matches pattern
  if (id && id.length > 0) {
    return {
      id,
      name: `Collection ${id.substring(0, 4)}`,
      description: "A unique NFT collection with bonding curve mechanics",
      creator: `creator${id.substring(0, 4)}`,
      metadataUri: `ipfs://QmHash${id}`,
      basePrice: 0.1,
      growthFactor: 0.00003606,
      marketCap: Math.random() * 100000,
      thresholdReached: Math.random() > 0.5,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  return null;
}

/**
 * Get all collections (simulated)
 * @param limit Maximum number of collections to return
 * @returns Array of collections
 */
export function getAllCollections(limit: number = 10): Collection[] {
  // In a real implementation, this would query the database
  // For simulation, we return mock collections
  
  const mockCollections: Collection[] = [];
  
  for (let i = 0; i < limit; i++) {
    const id = uuidv4();
    const marketCap = Math.random() * 100000;
    
    mockCollections.push({
      id,
      name: `Collection ${i + 1}`,
      description: "A unique NFT collection with bonding curve mechanics",
      creator: `creator${i}`,
      metadataUri: `ipfs://QmHash${id}`,
      basePrice: 0.1 + (Math.random() * 0.5),
      growthFactor: 0.00003606,
      marketCap,
      thresholdReached: marketCap >= 69000,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return mockCollections;
}
