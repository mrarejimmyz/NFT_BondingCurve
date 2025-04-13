"use client";

import { useState } from "react";
import Link from "next/link";
import BondingCurveChart from "@/components/bonding-curve/BondingCurveChart";

interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  creator: string;
  basePrice: number;
  growthFactor: number;
  marketCap: number;
  thresholdReached: boolean;
  itemCount: number;
}

export default function CollectionCard({
  id,
  name,
  description,
  creator,
  basePrice,
  growthFactor,
  marketCap,
  thresholdReached,
  itemCount
}: CollectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="card overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Created by {creator}</p>
          </div>
          <div>
            {thresholdReached ? (
              <span className="badge-success">Threshold Reached</span>
            ) : (
              <span className="badge-warning">Pre-Threshold</span>
            )}
          </div>
        </div>
        
        <p className="mt-4 text-sm line-clamp-2">
          {description}
        </p>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="stat-card">
            <p className="stat-label">Base Price</p>
            <p className="stat-value">{basePrice} SOL</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Market Cap</p>
            <p className="stat-value">{marketCap} SOL</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Items</p>
            <p className="stat-value">{itemCount}</p>
          </div>
        </div>
        
        <button 
          className="mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide Bonding Curve" : "Show Bonding Curve"}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6">
          <BondingCurveChart 
            basePrice={basePrice}
            growthFactor={growthFactor}
            currentMarketCap={marketCap}
          />
        </div>
      )}
      
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-between items-center">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Current Price: </span>
          <span className="font-bold">{(basePrice * Math.exp(growthFactor * marketCap)).toFixed(2)} SOL</span>
        </div>
        <Link href={`/collection/${id}`}>
          <button className="btn-primary">View Collection</button>
        </Link>
      </div>
    </div>
  );
}
