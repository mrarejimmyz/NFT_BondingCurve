import { NextRequest, NextResponse } from 'next/server';
import { getCollectionById } from '@/lib/services/collectionService';

/**
 * GET /api/collections/[id]
 * Retrieve a specific collection by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get collection
    const collection = getCollectionById(id);
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: collection 
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection' },
      { status: 500 }
    );
  }
}
