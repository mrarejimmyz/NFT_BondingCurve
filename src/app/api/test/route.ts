import { NextRequest, NextResponse } from "next/server";
import {
  calculatePrice,
  isThresholdReached,
} from "@/lib/services/bondingCurveService";
import { createNFT } from "@/lib/services/nftService";
import { getUserBalance } from "@/lib/services/walletService";
import { processNFTPurchase } from "@/lib/services/transactionService";
import {
  createCollection,
  updateCollectionMarketCap,
} from "@/lib/services/collectionService";

/**
 * GET /api/test
 * Test endpoint to verify all services are working correctly
 */
export async function GET(request: NextRequest) {
  try {
    // Test bonding curve calculations
    const basePrice = 0.1;
    const growthFactor = 0.00003606;
    const marketCaps = [0, 10000, 50000, 69000, 100000];

    const priceTests = marketCaps.map((marketCap) => {
      const price = calculatePrice(marketCap, basePrice, growthFactor);
      const thresholdReached = isThresholdReached(marketCap);

      return {
        marketCap,
        price,
        thresholdReached,
      };
    });

    // Test collection creation
    const collection = createCollection(
      "Test Collection",
      "A test collection for the BondingCurve platform",
      "testCreator123",
      basePrice,
      growthFactor
    );

    // Test NFT creation
    const nft = createNFT(
      collection.id,
      "Test NFT #1",
      "A test NFT for the BondingCurve platform",
      "https://picsum.photos/seed/test/300/300",
      [{ trait_type: "Rarity", value: "Common" }],
      "testOwner456",
      basePrice
    );

    // Test wallet balance
    const userBalance = getUserBalance("testOwner456");

    // Test transaction processing
    const transaction = processNFTPurchase(
      nft.id,
      collection.id,
      "testBuyer789",
      "testOwner456",
      collection.marketCap,
      collection.basePrice,
      collection.growthFactor
    );

    // Test market cap update
    const updatedMarketCap = updateCollectionMarketCap(
      collection.id,
      calculatePrice(
        collection.marketCap,
        collection.basePrice,
        collection.growthFactor
      )
    );

    return NextResponse.json({
      success: true,
      message: "All services are functioning correctly",
      data: {
        bondingCurveTests: priceTests,
        collection,
        nft,
        userBalance,
        transaction,
        updatedMarketCap,
      },
    });
  } catch (error) {
    console.error("Error during testing:", error);
    return NextResponse.json(
      { success: false, error: "Test failed" },
      { status: 500 }
    );
  }
}
