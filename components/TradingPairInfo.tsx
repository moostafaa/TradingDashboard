import React from 'react';

interface TradingPairInfoProps {
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  availableFunds: number; // New prop for available funds
  setAvailableFunds: (funds: number) => void; // New prop for setting available funds
}

const TradingPairInfo: React.FC<TradingPairInfoProps> = ({ 
  currentPrice, 
  priceChange, 
  priceChangePercentage,
  availableFunds,
  setAvailableFunds,
}) => {
  const priceColorClass = priceChange >= 0 ? 'text-green-500' : 'text-red-500';

  const handleAvailableFundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAvailableFunds(isNaN(value) ? 0 : value);
  };

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center flex-wrap md:flex-nowrap text-sm shadow-sm rounded-md">
      {/* Main Left Section: All info in a single horizontal flex row */}
      <div className="flex items-center space-x-4 flex-wrap gap-y-2 md:flex-nowrap md:gap-y-0"> {/* Use gap-y for wrapping */}
        {/* 1. Symbol + Perp */}
        <div className="flex items-center flex-shrink-0">
          <span className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold mr-2">B</span>
          <span className="text-gray-200 text-lg font-semibold whitespace-nowrap">BTC/USDT</span>
          <span className="ml-2 bg-gray-700 text-gray-400 px-2 py-0.5 rounded-md text-xs whitespace-nowrap">Perp</span>
        </div>

        {/* 2. Current Price */}
        <div className={`${priceColorClass} text-2xl font-bold whitespace-nowrap flex-shrink-0`}>
          ${currentPrice.toFixed(3)}
        </div>

        {/* 3. Available Funds Input */}
        <div className="flex items-center space-x-2 text-sm flex-shrink-0">
          <label htmlFor="availableFundsInput" className="text-gray-400 whitespace-nowrap">Available Funds (USDT):</label>
          <input
            id="availableFundsInput"
            type="number"
            value={availableFunds.toFixed(2)}
            onChange={handleAvailableFundsChange}
            className="bg-gray-700 text-gray-200 py-1 px-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 w-32"
            aria-label="Set Available Funds"
          />
        </div>

        {/* 4. 24h High */}
        <div className="text-gray-400 text-xs flex-shrink-0">
          <span className="text-gray-500">24h High:</span> <span className="text-gray-200">{95892.23.toFixed(2)}</span>
        </div>
        {/* 5. 24h Low */}
        <div className="text-gray-400 text-xs flex-shrink-0">
          <span className="text-gray-500">24h Low:</span> <span className="text-gray-200">{94994.32.toFixed(2)}</span>
        </div>
        {/* 6. 24h Volume(BTC) */}
        <div className="text-gray-400 text-xs flex-shrink-0">
          <span className="text-gray-500">24h Volume(BTC):</span> <span className="text-gray-200">{72.387}</span>
        </div>
        {/* 7. 24h Volume(USDT) */}
        <div className="text-gray-400 text-xs flex-shrink-0">
          <span className="text-gray-500">24h Volume(USDT):</span> <span className="text-gray-200">{873.9}M</span>
        </div>

      </div>

      {/* Right-aligned block: 24h Change */}
      <div className="flex flex-col items-end flex-shrink-0 ml-auto"> {/* ml-auto pushes it to the right */}
        <div className={`${priceColorClass} font-semibold whitespace-nowrap`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
        </div>
        <div className={`${priceColorClass} whitespace-nowrap`}>
          ({priceChangePercentage.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
};

export default TradingPairInfo;