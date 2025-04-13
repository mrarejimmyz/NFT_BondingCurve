import { NextRequest, NextResponse } from 'next/server';
import { getUserBalance, updateRealSolBalance, updateSyntheticSolBalance, convertSyntheticToReal } from '@/lib/services/walletService';

/**
 * GET /api/users
 * Retrieve users with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // In a real implementation, this would query the database
    // For simulation, we return mock users
    const mockUsers = Array.from({ length: limit }, (_, i) => {
      const address = `${Math.random().toString(36).substring(2, 10)}`;
      
      return {
        id: `user_${i}`,
        walletAddress: address,
        realSolBalance: parseFloat((Math.random() * 10).toFixed(2)),
        syntheticSolBalances: {
          "collection1": parseFloat((Math.random() * 5).toFixed(2)),
          "collection2": parseFloat((Math.random() * 3).toFixed(2))
        },
        joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      data: mockUsers 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create or update user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { walletAddress } = body;
    
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would create/update a user in the database
    // For simulation, we return a success response with mock data
    
    return NextResponse.json({ 
      success: true, 
      message: 'User created/updated successfully',
      data: {
        id: `user_${Math.random().toString(36).substring(2, 6)}`,
        walletAddress,
        realSolBalance: 0,
        syntheticSolBalances: {},
        joinedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update user' },
      { status: 500 }
    );
  }
}
