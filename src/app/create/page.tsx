"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BondingCurveChart from "@/components/bonding-curve/BondingCurveChart";

export default function CreateNFT() {
  const router = useRouter();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isCreatingNFT, setIsCreatingNFT] = useState(false);
  const [activeTab, setActiveTab] = useState<'collection' | 'nft'>('collection');
  
  // Collection form state
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [basePrice, setBasePrice] = useState(0.1);
  const [growthFactor, setGrowthFactor] = useState(0.00003606);
  
  // NFT form state
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [attributes, setAttributes] = useState<Array<{trait_type: string, value: string}>>([
    { trait_type: "", value: "" }
  ]);
  
  // Mock collections for dropdown
  const mockCollections = [
    { id: "col_1", name: "Cosmic Degens" },
    { id: "col_2", name: "Pixel Punks" },
    { id: "col_3", name: "Moon Apes" }
  ];
  
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCollection(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the API
      console.log("Creating collection:", {
        name: collectionName,
        description: collectionDescription,
        basePrice,
        growthFactor
      });
      
      // Reset form
      setCollectionName("");
      setCollectionDescription("");
      setBasePrice(0.1);
      setGrowthFactor(0.00003606);
      
      // Show success message
      alert("Collection created successfully!");
      
      // Switch to NFT tab
      setActiveTab('nft');
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection. Please try again.");
    } finally {
      setIsCreatingCollection(false);
    }
  };
  
  const handleCreateNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingNFT(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the API
      console.log("Creating NFT:", {
        name: nftName,
        description: nftDescription,
        collectionId: selectedCollection,
        attributes,
        imageFile: imageFile?.name
      });
      
      // Reset form
      setNftName("");
      setNftDescription("");
      setSelectedCollection("");
      setImageFile(null);
      setAttributes([{ trait_type: "", value: "" }]);
      
      // Show success message
      alert("NFT created successfully!");
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error("Error creating NFT:", error);
      alert("Failed to create NFT. Please try again.");
    } finally {
      setIsCreatingNFT(false);
    }
  };
  
  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };
  
  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };
  
  const handleAttributeChange = (index: number, field: 'trait_type' | 'value', value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create on pump.fun</h1>
      
      <div className="mb-8">
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            className={`${
              activeTab === 'collection' ? 'tab-active' : 'tab-inactive'
            } mr-2`}
            onClick={() => setActiveTab('collection')}
          >
            Create Collection
          </button>
          <button
            className={`${
              activeTab === 'nft' ? 'tab-active' : 'tab-inactive'
            }`}
            onClick={() => setActiveTab('nft')}
          >
            Create NFT
          </button>
        </div>
      </div>
      
      {activeTab === 'collection' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Create a New Collection</h2>
          
          <form onSubmit={handleCreateCollection}>
            <div className="mb-4">
              <label htmlFor="collectionName" className="label">Collection Name</label>
              <input
                id="collectionName"
                type="text"
                className="input"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="collectionDescription" className="label">Description</label>
              <textarea
                id="collectionDescription"
                className="input h-24"
                value={collectionDescription}
                onChange={(e) => setCollectionDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="basePrice" className="label">Base Price (SOL)</label>
                <input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="input"
                  value={basePrice}
                  onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="growthFactor" className="label">Growth Factor</label>
                <input
                  id="growthFactor"
                  type="number"
                  step="0.00000001"
                  min="0.00000001"
                  className="input"
                  value={growthFactor}
                  onChange={(e) => setGrowthFactor(parseFloat(e.target.value))}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Default: 0.00003606</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-2">Bonding Curve Preview</h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <BondingCurveChart
                  basePrice={basePrice}
                  growthFactor={growthFactor}
                  currentMarketCap={0}
                />
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <h3 className="text-md font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important Information</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>Threshold activation occurs at $69k market cap</li>
                <li>First buyer pays 0.02 SOL creation fee</li>
                <li>Creator receives 0.5 SOL reward on first purchase</li>
                <li>Platform fee: 2% on all transactions</li>
              </ul>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isCreatingCollection}
            >
              {isCreatingCollection ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Collection...
                </span>
              ) : (
                "Create Collection"
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Create a New NFT</h2>
          
          <form onSubmit={handleCreateNFT}>
            <div className="mb-4">
              <label htmlFor="nftName" className="label">NFT Name</label>
              <input
                id="nftName"
                type="text"
                className="input"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="nftDescription" className="label">Description</label>
              <textarea
                id="nftDescription"
                className="input h-24"
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="collection" className="label">Collection</label>
              <select
                id="collection"
                className="input"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                required
              >
                <option value="">Select a collection</option>
                {mockCollections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="image" className="label">Image</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  required
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  {imageFile ? (
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {imageFile.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        className="text-sm text-red-500 hover:text-red-600 mt-2"
                        onClick={() => setImageFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="label">Attributes</label>
                <button
                  type="button"
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  onClick={handleAddAttribute}
                >
                  + Add Attribute
                </button>
              </div>
              
              {attributes.map((attr, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Trait Type"
                    className="input flex-1"
                    value={attr.trait_type}
                    onChange={(e) => handleAttributeChange(index, 'trait_type', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="input flex-1"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                    required
                  />
                  {attributes.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isCreatingNFT}
            >
              {isCreatingNFT ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating NFT...
                </span>
              ) : (
                "Create NFT"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
