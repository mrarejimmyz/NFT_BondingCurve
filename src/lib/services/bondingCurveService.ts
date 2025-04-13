/**
 * Bonding Curve Service
 * 
 * This service handles the bonding curve calculations for NFT pricing
 * based on market capitalization.
 */

/**
 * Calculate price based on bonding curve formula
 * @param currentMarketCap Current market cap in SOL
 * @param basePrice Base price in SOL
 * @param growthFactor Growth factor (default: 0.00003606)
 * @returns Calculated price in SOL
 */
export function calculatePrice(
  currentMarketCap: number, 
  basePrice: number, 
  growthFactor: number = 0.00003606
): number {
  return basePrice * Math.exp(growthFactor * currentMarketCap);
}

/**
 * Check if market cap has reached threshold
 * @param marketCap Current market cap in SOL
 * @returns Boolean indicating if threshold is reached
 */
export function isThresholdReached(marketCap: number): boolean {
  // Threshold is set at $69k equivalent
  const THRESHOLD = 69000;
  return marketCap >= THRESHOLD;
}

/**
 * Calculate new market cap after purchase
 * @param currentMarketCap Current market cap in SOL
 * @param purchaseAmount Purchase amount in SOL
 * @returns New market cap
 */
export function calculateNewMarketCap(
  currentMarketCap: number,
  purchaseAmount: number
): number {
  return currentMarketCap + purchaseAmount;
}

/**
 * Calculate platform fee
 * @param amount Transaction amount
 * @param feePercentage Fee percentage (default: 2%)
 * @returns Fee amount
 */
export function calculatePlatformFee(
  amount: number,
  feePercentage: number = 2
): number {
  return amount * (feePercentage / 100);
}

/**
 * Generate price history points for visualization
 * @param basePrice Base price in SOL
 * @param growthFactor Growth factor
 * @param maxMarketCap Maximum market cap to calculate
 * @param points Number of points to generate
 * @returns Array of price points
 */
export function generatePriceHistory(
  basePrice: number,
  growthFactor: number = 0.00003606,
  maxMarketCap: number = 100000,
  points: number = 100
): Array<{marketCap: number, price: number}> {
  return Array.from({ length: points }, (_, i) => {
    const marketCap = (i / (points - 1)) * maxMarketCap;
    return {
      marketCap,
      price: calculatePrice(marketCap, basePrice, growthFactor)
    };
  });
}
