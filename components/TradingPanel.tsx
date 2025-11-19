import React, { useState, useEffect } from 'react';

interface TradingPanelProps {
  selectedPriceFromOrderBook: number | null;
  availableFunds: number; // New prop for available funds
}

const TradingPanel: React.FC<TradingPanelProps> = ({ selectedPriceFromOrderBook, availableFunds }) => {
  const [orderType, setOrderType] = useState('Limit');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [margin, setMargin] = useState('0'); // Margin is calculated based on amount * price / leverage
  const [leverage, setLeverage] = useState('10X');
  const [selectedTab, setSelectedTab] = useState('Cross');
  const [sliderPercentage, setSliderPercentage] = useState(0); // New state for slider

  // Helper to calculate maximum tradable amount
  const calculateMaxTradableAmount = (funds: number, currentPrice: number, currentLeverage: string) => {
    const leverageValue = parseFloat(currentLeverage.replace('X', ''));
    if (funds > 0 && currentPrice > 0 && leverageValue > 0) {
      // For simplicity, we assume margin required is full value / leverage
      // In a real app, margin calculation is more complex
      return (funds * leverageValue) / currentPrice;
    }
    return 0;
  };

  useEffect(() => {
    if (selectedPriceFromOrderBook !== null) {
      setPrice(selectedPriceFromOrderBook.toFixed(3)); // Update price input with selected order book price

      // Calculate max tradable amount based on available funds and selected price
      if (availableFunds > 0 && selectedPriceFromOrderBook > 0) {
        const maxAmount = calculateMaxTradableAmount(availableFunds, selectedPriceFromOrderBook, leverage);
        setAmount(maxAmount.toFixed(4)); // Display up to 4 decimal places for BTC amount
        setSliderPercentage(100); // Set slider to 100% as we're showing max amount

        // Recalculate margin based on new amount and price
        const leverageValue = parseFloat(leverage.replace('X', ''));
        if (!isNaN(maxAmount) && !isNaN(selectedPriceFromOrderBook) && leverageValue > 0) {
          const estimatedMargin = (maxAmount * selectedPriceFromOrderBook) / leverageValue;
          setMargin(estimatedMargin.toFixed(2));
        } else {
          setMargin('0');
        }
      } else {
        setAmount('0');
        setMargin('0');
        setSliderPercentage(0);
      }
    }
  }, [selectedPriceFromOrderBook, availableFunds, leverage]); // Recalculate if price, funds, or leverage changes

  // Handler for amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = e.target.value;
    setAmount(newAmount);

    const parsedAmount = parseFloat(newAmount);
    const parsedPrice = parseFloat(price);
    const leverageValue = parseFloat(leverage.replace('X', ''));

    if (!isNaN(parsedAmount) && !isNaN(parsedPrice) && leverageValue > 0) {
      const estimatedMargin = (parsedAmount * parsedPrice) / leverageValue;
      setMargin(estimatedMargin.toFixed(2));

      // Update slider percentage based on new amount
      const maxPossibleAmount = calculateMaxTradableAmount(availableFunds, parsedPrice, leverage);
      if (maxPossibleAmount > 0) {
        setSliderPercentage((parsedAmount / maxPossibleAmount) * 100);
      } else {
        setSliderPercentage(0);
      }
    } else {
      setMargin('0');
      setSliderPercentage(0);
    }
  };

  // Handler for leverage change
  const handleLeverageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLeverage = e.target.value;
    setLeverage(newLeverage);

    const parsedPrice = parseFloat(price);
    if (availableFunds > 0 && parsedPrice > 0) {
      // Recalculate max amount and margin for the new leverage
      const newMaxAmount = calculateMaxTradableAmount(availableFunds, parsedPrice, newLeverage);
      setAmount(newMaxAmount.toFixed(4));
      setSliderPercentage(100);

      const leverageValue = parseFloat(newLeverage.replace('X', ''));
      if (!isNaN(newMaxAmount) && !isNaN(parsedPrice) && leverageValue > 0) {
        const estimatedMargin = (newMaxAmount * parsedPrice) / leverageValue;
        setMargin(estimatedMargin.toFixed(2));
      } else {
        setMargin('0');
      }
    } else {
      setAmount('0');
      setMargin('0');
      setSliderPercentage(0);
    }
  };

  // Handler for slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseFloat(e.target.value);
    setSliderPercentage(newPercentage);

    const parsedPrice = parseFloat(price);
    if (availableFunds > 0 && parsedPrice > 0) {
      const maxPossibleAmount = calculateMaxTradableAmount(availableFunds, parsedPrice, leverage);
      const newAmount = (maxPossibleAmount * newPercentage) / 100;
      setAmount(newAmount.toFixed(4));

      const leverageValue = parseFloat(leverage.replace('X', ''));
      if (!isNaN(newAmount) && !isNaN(parsedPrice) && leverageValue > 0) {
        const estimatedMargin = (newAmount * parsedPrice) / leverageValue;
        setMargin(estimatedMargin.toFixed(2));
      } else {
        setMargin('0');
      }
    } else {
      setAmount('0');
      setMargin('0');
    }
  };

  const parsedPrice = parseFloat(price);
  const currentAmount = parseFloat(amount);
  const maxAmountForSliderDisplay = calculateMaxTradableAmount(availableFunds, parsedPrice, leverage);

  return (
    <div className="bg-gray-800 rounded-md p-4 shadow-sm flex flex-col">
      {/* Funding & Settlement */}
      <div className="flex justify-between items-center text-xs mb-4">
        <span className="text-gray-400">Funding / Settlement</span>
        <div className="flex items-center space-x-2">
          <span className="text-red-500">-0.0074% / 04:37:00</span>
          <span className="text-green-500 flex items-center">
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

      {/* Cross/Isolated and Leverage */}
      <div className="flex items-center space-x-2 mb-4">
        {['Cross', 'Isolated'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
              selectedTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
        <div className="relative">
          <select
            value={leverage}
            onChange={handleLeverageChange}
            className="appearance-none bg-gray-700 text-gray-200 py-1 pl-3 pr-8 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option>5X</option>
            <option>10X</option>
            <option>20X</option>
            <option>50X</option>
            <option>100X</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <button className="bg-gray-700 text-gray-400 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-600">S</button>
      </div>

      {/* Order Type */}
      <div className="relative mb-4">
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
          className="appearance-none w-full bg-gray-700 text-gray-200 py-2 pl-3 pr-8 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option>Limit</option>
          <option>Market</option>
          <option>Stop Limit</option>
          <option>Stop Market</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Price Input */}
      <div className="mb-4">
        <label htmlFor="price" className="block text-gray-400 text-xs mb-1">Price</label>
        <div className="relative flex items-center">
          <input
            id="price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-700 text-gray-200 py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            aria-label="Order Price"
          />
          <span className="absolute right-3 text-gray-400 text-sm">BBO</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-400 text-xs mb-1">Amount</label>
        <div className="relative flex items-center">
          <input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full bg-gray-700 text-gray-200 py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            aria-label="Order Amount"
          />
          <span className="absolute right-3 text-gray-400 text-sm">USDT</span>
        </div>
        <p className="text-gray-500 text-xs mt-1">Margin: {margin} USDT</p>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{currentAmount.toFixed(2)} / {maxAmountForSliderDisplay.toFixed(2)} BTC</span>
          <span>{sliderPercentage.toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPercentage}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer range-sm accent-orange-500"
          aria-label="Order Amount Percentage"
        />
      </div>

      {/* TP/SL Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="tpsl" className="accent-orange-500" aria-label="Take Profit Stop Loss" />
          <label htmlFor="tpsl" className="text-gray-200 text-sm">TP/SL</label>
        </div>
      </div>

      {/* Available Funds */}
      <div className="flex justify-between items-center text-xs mb-4">
        <span className="text-gray-400">Available</span>
        <span className="text-gray-200">{availableFunds.toFixed(2)} USDT</span>
      </div>

      {/* Action Buttons - Changed to flex-col for vertical stacking */}
      <div className="flex flex-col space-y-2 mb-4">
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold text-lg transition-colors">
          Buy/Long
        </button>
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold text-lg transition-colors">
          Sell/Short
        </button>
      </div>

      {/* Deposit/Transfer */}
      <div className="flex space-x-2 text-sm">
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-md transition-colors">
          Deposit
        </button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 rounded-md transition-colors">
          Transfer
        </button>
      </div>
    </div>
  );
};

export default TradingPanel;