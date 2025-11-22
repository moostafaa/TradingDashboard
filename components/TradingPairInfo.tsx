
import React from 'react';

interface TradingPairInfoProps {
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  high24h: number;
  low24h: number;
  volumeBTC: number;
  volumeUSDT: number;
}

const TradingPairInfo: React.FC<TradingPairInfoProps> = ({ 
  currentPrice, 
  priceChange, 
  priceChangePercentage,
  high24h,
  low24h,
  volumeBTC,
  volumeUSDT,
}) => {
  const priceColorClass = priceChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center flex-wrap lg:flex-nowrap text-sm shadow-sm rounded-md">
      {/* Left main block: Symbol, Price, 24h Change, 24h High/Low/Volume */}
      <div className="flex items-center flex-wrap lg:flex-nowrap gap-x-3 gap-y-2">
        {/* Symbol + Perp */}
        <div className="flex items-center flex-shrink-0 whitespace-nowrap">
          <span className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold mr-2">B</span>
          <span className="text-gray-200 text-lg font-semibold">BTC/USDT</span>
          <span className="ml-2 bg-gray-700 text-gray-400 px-2 py-0.5 rounded-md text-xs">Perp</span>
        </div>

        {/* Current Price */}
        <div className={`${priceColorClass} text-2xl font-bold flex-shrink-0 whitespace-nowrap`}>
          ${currentPrice.toFixed(3)}
        </div>

        {/* 24h Change (value only, inline with price, no top label) */}
        <div className={`${priceColorClass} text-base font-semibold flex-shrink-0 whitespace-nowrap`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercentage.toFixed(2)}%)
        </div>

        {/* 24h High */}
        <div className="flex flex-col text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
          <span className="text-gray-500">24h High</span> <span className="text-gray-200 text-sm font-semibold">{high24h.toFixed(2)}</span>
        </div>
        {/* 24h Low */}
        <div className="flex flex-col text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
          <span className="text-gray-500">24h Low</span> <span className="text-gray-200 text-sm font-semibold">{low24h.toFixed(2)}</span>
        </div>
        {/* 24h Volume(BTC) */}
        <div className="flex flex-col text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
          <span className="text-gray-500">24h Volume(BTC)</span> <span className="text-gray-200 text-sm font-semibold">{volumeBTC.toFixed(3)}</span>
        </div>
        {/* 24h Volume(USDT) */}
        <div className="flex flex-col text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
          <span className="text-gray-500">24h Volume(USDT)</span> <span className="text-gray-200 text-sm font-semibold">{volumeUSDT.toFixed(1)}M</span>
        </div>
      </div>

      {/* Right-aligned block: Funding / Settlement (now with label above value, and items spaced) */}
      <div className="flex flex-col items-end flex-shrink-0 ml-auto whitespace-nowrap">
        <span className="text-gray-500 text-xs mb-1">Funding / Settlement</span>
        <div className="flex items-center gap-x-4"> {/* Increased gap-x for independent items */}
          <span className="text-red-500 text-sm font-semibold">-0.0074% / 04:37:00</span>
          <span className="text-green-500 flex items-center text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
            </svg>
            2.33%
          </span>
          <button className="text-gray-500 hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingPairInfo;