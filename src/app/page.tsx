"use client";

import { useState } from "react";
import NFTGrid from "@/components/nft/NFTGrid";
import BondingCurveChart from "@/components/bonding-curve/BondingCurveChart";
import WalletConnector from "@/components/wallet/WalletConnector";

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  
  const handleConnect = (address: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
  };
  
  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Discover NFTs</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore and trade NFTs with dynamic pricing based on bonding curves
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <WalletConnector 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
        
        <div className="mb-12">
          <div className="bg-purple-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">How Bonding Curves Work</h2>
            <p className="mb-6">
              Bonding curves create dynamic pricing based on market cap. As more people buy into a collection, 
              the price increases exponentially. When the market cap reaches $69k, the threshold is activated.
            </p>
            <BondingCurveChart 
              basePrice={0.1}
              growthFactor={0.00003606}
              currentMarketCap={35000}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured NFTs</h2>
            <a href="/collections" className="text-purple-600 dark:text-purple-400 hover:underline">
              View All Collections
            </a>
          </div>
          
          <NFTGrid />
        </div>
      </section>
    </div>
  );
}
