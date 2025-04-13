"use client";

import { useState, useEffect } from "react";
import * as d3 from "d3";

interface BondingCurveProps {
  basePrice: number;
  growthFactor: number;
  currentMarketCap: number;
  width?: number;
  height?: number;
}

export default function BondingCurveChart({
  basePrice,
  growthFactor,
  currentMarketCap,
  width = 600,
  height = 300
}: BondingCurveProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    if (mounted) {
      renderChart();
    }
    
    return () => {
      // Clean up
      d3.select("#bonding-curve-container svg").remove();
    };
  }, [mounted, basePrice, growthFactor, currentMarketCap]);
  
  const calculatePrice = (marketCap: number) => {
    return basePrice * Math.exp(growthFactor * marketCap);
  };
  
  const renderChart = () => {
    // Clear previous chart
    d3.select("#bonding-curve-container svg").remove();
    
    // Create SVG
    const svg = d3.select("#bonding-curve-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");
    
    // Generate data points
    const maxMarketCap = Math.max(currentMarketCap * 2, 100000);
    const data = Array.from({ length: 100 }, (_, i) => {
      const marketCap = (i / 99) * maxMarketCap;
      return {
        marketCap,
        price: calculatePrice(marketCap)
      };
    });
    
    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([0, maxMarketCap])
      .range([50, width - 30]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.price) || 10])
      .range([height - 40, 20]);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => `${d3.format(".0s")(Number(d))}`);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${Number(d).toFixed(2)} SOL`);
    
    svg.append("g")
      .attr("transform", `translate(0, ${height - 40})`)
      .call(xAxis);
    
    svg.append("g")
      .attr("transform", "translate(50, 0)")
      .call(yAxis);
    
    // Add labels
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("class", "text-xs text-gray-500")
      .text("Market Cap (SOL)");
    
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -height / 2)
      .attr("class", "text-xs text-gray-500")
      .text("Price (SOL)");
    
    // Create line generator
    const line = d3.line<{marketCap: number, price: number}>()
      .x(d => xScale(d.marketCap))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX);
    
    // Add curve path
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "rgb(111, 76, 255)")
      .attr("stroke-width", 2)
      .attr("d", line);
    
    // Add current market cap indicator
    const currentPrice = calculatePrice(currentMarketCap);
    
    svg.append("circle")
      .attr("cx", xScale(currentMarketCap))
      .attr("cy", yScale(currentPrice))
      .attr("r", 6)
      .attr("fill", "rgb(255, 105, 180)");
    
    // Add threshold indicator at $69k
    const thresholdMarketCap = 69000;
    if (thresholdMarketCap <= maxMarketCap) {
      const thresholdPrice = calculatePrice(thresholdMarketCap);
      
      svg.append("line")
        .attr("x1", xScale(thresholdMarketCap))
        .attr("y1", height - 40)
        .attr("x2", xScale(thresholdMarketCap))
        .attr("y2", yScale(thresholdPrice))
        .attr("stroke", "rgb(0, 255, 170)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4");
      
      svg.append("text")
        .attr("x", xScale(thresholdMarketCap) + 5)
        .attr("y", yScale(thresholdPrice) - 10)
        .attr("class", "text-xs font-medium")
        .attr("fill", "rgb(0, 255, 170)")
        .text("Threshold");
    }
    
    // Add current position label
    svg.append("text")
      .attr("x", xScale(currentMarketCap) + 10)
      .attr("y", yScale(currentPrice) + 5)
      .attr("class", "text-xs font-medium")
      .text(`${currentPrice.toFixed(2)} SOL`);
  };
  
  return (
    <div className="bonding-curve-container p-4" id="bonding-curve-container">
      {!mounted && <div className="flex items-center justify-center h-full">Loading chart...</div>}
    </div>
  );
}
