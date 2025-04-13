import { NextRequest, NextResponse } from 'next/server';
import { createNFT } from '@/lib/services/nftService';
import { processNFTMinting } from '@/lib/services/transactionService';

/**
 * GET /api/nfts
 * Retrieve NFTs with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const collectionId = searchParams.get('collectionId');
    const owner = searchParams.get('owner');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // In a real implementation, this would query the database
    // For simulation, we return mock NFTs
    const mockNFTs = Array.from({ length: limit }, (_, i) => {
      const id = `nft_${i}_${Math.random().toString(36).substring(2, 6)}`;
      return {
        id,
        collectionId: collectionId || `col_${Math.random().toString(36).substring(2, 6)}`,
        name: `NFT #${i + 1}`,
        description: "A unique digital collectible",
        imageUri: `https://picsum.photos/seed/${id}/300/300`,
        metadataUri: `ipfs://QmHash${id}`,
        owner: owner || `owner${Math.random().toString(36).substring(2, 6)}`,
        price: parseFloat((Math.random() * 5).toFixed(2)),
        createdAt: new Date(),
        updatedAt: new Date(),
        attributes: [
          { trait_type: "Rarity", value: "Common" },
          { trait_type: "Type", value: "Avatar" }
        ]
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      data: mockNFTs 
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/nfts
 * Create a new NFT
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      collectionId, 
      name, 
      description, 
      imageUri, 
      attributes, 
      owner, 
      price 
    } = body;
    
    if (!collectionId || !name || !imageUri || !owner) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would create an NFT in the database
    // For simulation, we return a success response with mock data
    
    // Create NFT
    const nft = createNFT(
      collectionId,
      name,
      description || "",
      imageUri,
      attributes || [],
      owner,
      price || 0.1
    );
    
    // Process minting transaction
    const transaction = processNFTMinting(
      nft.id,
      collectionId,
      owner,
      body.creator || owner,
      price || 0.1
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'NFT created successfully',
      data: {
        nft,
        transaction
      }
    });
  } catch (error) {
    console.error('Error creating NFT:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create NFT' },
      { status: 500 }
    );
  }
}
