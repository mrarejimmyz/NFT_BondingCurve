import { NextRequest, NextResponse } from 'next/server';
import { getAllCollections, getCollectionById } from '@/lib/services/collectionService';

/**
 * GET /api/collections
 * Retrieve all collections
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Get collections
    const collections = getAllCollections(limit);
    
    return NextResponse.json({ 
      success: true, 
      data: collections 
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/collections
 * Create a new collection
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, description, creator, basePrice, growthFactor } = body;
    
    if (!name || !description || !creator || !basePrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would create a collection in the database
    // For simulation, we return a success response
    
    return NextResponse.json({ 
      success: true, 
      message: 'Collection created successfully',
      data: {
        id: 'col_' + Math.random().toString(36).substring(2, 10),
        name,
        description,
        creator,
        basePrice,
        growthFactor: growthFactor || 0.00003606,
        marketCap: 0,
        thresholdReached: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
