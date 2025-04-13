/**
 * NFT Service
 * 
 * This service handles NFT metadata and storage operations.
 */

import { v4 as uuidv4 } from 'uuid';

// Types
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  collection: {
    name: string;
    family: string;
  };
}

export interface NFT {
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

/**
 * Generate IPFS URI (simulated)
 * @param content Content to generate URI for
 * @returns Simulated IPFS URI
 */
export function generateIPFSUri(content: string): string {
  // In a real implementation, this would upload to IPFS
  // For simulation, we generate a fake IPFS hash
  const hash = Array.from({ length: 46 }, () => 
    "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[
      Math.floor(Math.random() * 58)
    ]
  ).join("");
  
  return `ipfs://Qm${hash}`;
}

/**
 * Create NFT metadata
 * @param name NFT name
 * @param description NFT description
 * @param imageUri Image URI
 * @param attributes NFT attributes
 * @param collectionName Collection name
 * @param collectionFamily Collection family
 * @returns NFT metadata object
 */
export function createNFTMetadata(
  name: string,
  description: string,
  imageUri: string,
  attributes: Array<{trait_type: string, value: string}>,
  collectionName: string,
  collectionFamily: string = "PFP"
): NFTMetadata {
  return {
    name,
    description,
    image: imageUri,
    attributes,
    collection: {
      name: collectionName,
      family: collectionFamily
    }
  };
}

/**
 * Create new NFT
 * @param collectionId Collection ID
 * @param name NFT name
 * @param description NFT description
 * @param imageUri Image URI
 * @param attributes NFT attributes
 * @param owner Owner address
 * @param price Initial price
 * @returns NFT object
 */
export function createNFT(
  collectionId: string,
  name: string,
  description: string,
  imageUri: string,
  attributes: Array<{trait_type: string, value: string}>,
  owner: string,
  price: number
): NFT {
  const id = uuidv4();
  const metadataUri = generateIPFSUri(JSON.stringify({
    name,
    description,
    image: imageUri,
    attributes
  }));
  
  return {
    id,
    collectionId,
    name,
    description,
    imageUri,
    metadataUri,
    owner,
    price,
    createdAt: new Date(),
    updatedAt: new Date(),
    attributes
  };
}

/**
 * Simulate IPFS upload
 * @param file File data (base64 or blob)
 * @returns Simulated IPFS URI
 */
export function simulateIPFSUpload(file: string): string {
  // In a real implementation, this would upload to IPFS
  // For simulation, we generate a fake IPFS hash
  return generateIPFSUri(file);
}

/**
 * Get NFT by ID (simulated)
 * @param id NFT ID
 * @returns NFT object or null if not found
 */
export function getNFTById(id: string): NFT | null {
  // In a real implementation, this would query the database
  // For simulation, we return a mock NFT if ID matches pattern
  if (id && id.length > 0) {
    return {
      id,
      collectionId: "col_" + id.substring(0, 8),
      name: `NFT #${id.substring(0, 4)}`,
      description: "A unique digital collectible",
      imageUri: `https://picsum.photos/seed/${id}/300/300`,
      metadataUri: `ipfs://QmHash${id}`,
      owner: `owner${id.substring(0, 4)}`,
      price: parseFloat((Math.random() * 5).toFixed(2)),
      createdAt: new Date(),
      updatedAt: new Date(),
      attributes: [
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Type", value: "Avatar" }
      ]
    };
  }
  
  return null;
}
