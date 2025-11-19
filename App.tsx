import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TradingPairInfo from './components/TradingPairInfo';
import TradingViewChart from './components/TradingViewChart';
import OrderBook from './components/OrderBook';
import TradingPanel from './components/TradingPanel';
import PositionsTable from './components/PositionsTable';
import { INITIAL_MARKET_PRICE, INITIAL_AVAILABLE_FUNDS } from './constants';

const App: React.FC = () => {
  const [currentMarketPrice, setCurrentMarketPrice] = useState(INITIAL_MARKET_PRICE);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercentage, setPriceChangePercentage] = useState(0);
  const previousPriceRef = useRef(INITIAL_MARKET_PRICE);

  const [selectedOrderPrice, setSelectedOrderPrice] = useState<number | null>(null);
  const [availableFunds, setAvailableFunds] = useState<number>(INITIAL_AVAILABLE_FUNDS); // Mock available funds

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuationRange = 100; // Max price fluctuation per update
      const newPrice = currentMarketPrice + (Math.random() - 0.5) * fluctuationRange;

      const change = newPrice - previousPriceRef.current;
      const percentage = (change / previousPriceRef.current) * 100;

      setCurrentMarketPrice(newPrice);
      setPriceChange(change);
      setPriceChangePercentage(percentage);
      previousPriceRef.current = newPrice;
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [currentMarketPrice]); // Depend on currentMarketPrice to re-run the effect for continuous updates

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="p-4 pb-0">
        <TradingPairInfo
          currentPrice={currentMarketPrice}
          priceChange={priceChange}
          priceChangePercentage={priceChangePercentage}
          availableFunds={availableFunds}
          setAvailableFunds={setAvailableFunds}
        />
      </div>

      <main className="flex-grow p-4 grid grid-cols-1 xl:grid-cols-5 xl:grid-rows-[1fr_min-content] gap-4">
        {/* First row: Chart, OrderBook, TradingPanel */}
        {/* TradingView Chart - spans 3 columns in the first row */}
        <div className="xl:col-span-3 xl:row-start-1 h-full">
          <TradingViewChart />
        </div>

        {/* Order Book - spans 1 column in the first row */}
        <div className="xl:col-span-1 xl:row-start-1 h-full">
          <OrderBook currentMarketPrice={currentMarketPrice} onPriceSelect={setSelectedOrderPrice} />
        </div>

        {/* Trading Panel - spans 1 column in the first row */}
        <div className="xl:col-span-1 xl:row-start-1 h-full">
          <TradingPanel
            selectedPriceFromOrderBook={selectedOrderPrice}
            availableFunds={availableFunds} // Pass available funds
          />
        </div>

        {/* Second row: Positions Table (full width) */}
        {/* Positions Table - spans all 5 columns in the second row */}
        <div className="xl:col-span-5 xl:row-start-2 h-[200px]">
          <PositionsTable />
        </div>
      </main>
    </div>
  );
};

export default App;