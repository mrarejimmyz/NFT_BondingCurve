import { NextRequest, NextResponse } from 'next/server';
import { getUserBalance, updateRealSolBalance, updateSyntheticSolBalance } from '@/lib/services/walletService';

/**
 * GET /api/users/[address]
 * Retrieve user information by wallet address
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
    
    // Get user balance
    const userBalance = getUserBalance(address);
    
    return NextResponse.json({ 
      success: true, 
      data: {
        walletAddress: address,
        ...userBalance
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
