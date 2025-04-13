import { NextRequest, NextResponse } from 'next/server';
import { getNFTTransactionHistory, processNFTPurchase } from '@/lib/services/transactionService';
import { calculatePrice } from '@/lib/services/bondingCurveService';
import { getCollectionById, updateCollectionMarketCap } from '@/lib/services/collectionService';

/**
 * GET /api/transactions
 * Retrieve transactions with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const nftId = searchParams.get('nftId');
    const collectionId = searchParams.get('collectionId');
    const buyer = searchParams.get('buyer');
    const seller = searchParams.get('seller');
    
    if (nftId) {
      // Get transaction history for specific NFT
      const transactions = getNFTTransactionHistory(nftId);
      return NextResponse.json({ 
        success: true, 
        data: transactions 
      });
    }
    
    // In a real implementation, this would query the database with filters
    // For simulation, we return mock transactions
    const mockTransactions = Array.from({ length: 10 }, (_, i) => {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - i);
      
      return {
        id: `tx_${i}_${Math.random().toString(36).substring(2, 6)}`,
        nftId: `nft_${Math.random().toString(36).substring(2, 6)}`,
        collectionId: collectionId || `col_${Math.random().toString(36).substring(2, 6)}`,
        buyer: buyer || `buyer${Math.random().toString(36).substring(2, 6)}`,
        seller: seller || (Math.random() > 0.2 ? `seller${Math.random().toString(36).substring(2, 6)}` : null),
        price: parseFloat((Math.random() * 5).toFixed(2)),
        timestamp,
        transactionType: Math.random() > 0.2 ? 'BUY' : (Math.random() > 0.5 ? 'SELL' : 'MINT')
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      data: mockTransactions 
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/transactions
 * Create a new transaction (buy/sell NFT)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      nftId, 
      collectionId, 
      buyer, 
      seller, 
      transactionType 
    } = body;
    
    if (!nftId || !collectionId || !buyer || !transactionType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get collection for pricing info
    const collection = getCollectionById(collectionId);
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }
    
    // Process transaction based on type
    if (transactionType === 'BUY') {
      if (!seller) {
        return NextResponse.json(
          { success: false, error: 'Seller is required for BUY transactions' },
          { status: 400 }
        );
      }
      
      // Process purchase
      const transaction = processNFTPurchase(
        nftId,
        collectionId,
        buyer,
        seller,
        collection.marketCap,
        collection.basePrice,
        collection.growthFactor
      );
      
      // Update collection market cap
      const price = calculatePrice(
        collection.marketCap, 
        collection.basePrice, 
        collection.growthFactor
      );
      
      const { marketCap, thresholdReached } = updateCollectionMarketCap(
        collectionId,
        price
      );
      
      return NextResponse.json({ 
        success: true, 
        message: 'Transaction completed successfully',
        data: {
          transaction,
          collection: {
            ...collection,
            marketCap,
            thresholdReached
          }
        }
      });
    } else {
      // For other transaction types (not fully implemented in this demo)
      return NextResponse.json(
        { success: false, error: `Transaction type ${transactionType} not implemented` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}
