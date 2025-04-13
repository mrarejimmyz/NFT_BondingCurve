import { NextRequest, NextResponse } from 'next/server';
import { getNFTById, createNFT } from '@/lib/services/nftService';

/**
 * GET /api/nfts/[id]
 * Retrieve a specific NFT by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get NFT
    const nft = getNFTById(id);
    
    if (!nft) {
      return NextResponse.json(
        { success: false, error: 'NFT not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: nft 
    });
  } catch (error) {
    console.error('Error fetching NFT:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch NFT' },
      { status: 500 }
    );
  }
}
