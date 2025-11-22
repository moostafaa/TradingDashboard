
import React, { useState } from 'react';
import { OrderBookEntry, TradeEntry } from '../types';

interface OrderBookRowProps {
  entry: OrderBookEntry;
  type: 'buy' | 'sell';
  maxTotal: number; // Max total for calculating width of background bar
  onPriceSelect: (price: number) => void;
}

const OrderBookRow: React.FC<OrderBookRowProps> = ({ entry, type, maxTotal, onPriceSelect }) => {
  const percentageWidth = (entry.total! / maxTotal) * 100;
  const bgColor = type === 'buy' ? 'bg-green-500/10' : 'bg-red-500/10';
  const priceColor = type === 'buy' ? 'text-green-400' : 'text-red-400';

  return (
    <div
      className="relative flex justify-between items-center py-0.5 text-xs cursor-pointer hover:bg-gray-700 transition-colors"
      onClick={() => onPriceSelect(entry.price)}
    >
      <div
        className={`absolute h-full ${bgColor} z-0`}
        style={{ width: `${percentageWidth}%`, right: type === 'buy' ? 'auto' : '0', left: type === 'buy' ? '0' : 'auto' }}
      ></div>
      <span className={`w-1/3 text-left ${priceColor} z-10`}>{entry.price.toFixed(0)}</span>
      <span className="w-1/3 text-center text-gray-300 z-10">{entry.amount.toFixed(2)}</span>
      <span className="w-1/3 text-right text-gray-400 z-10">{entry.total!.toFixed(2)}</span>
    </div>
  );
};

interface OrderBookProps {
  currentMarketPrice: number;
  onPriceSelect: (price: number | null) => void; // Allow null to reset selection
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
  tradeHistory: TradeEntry[]; // New prop for trade history
}

const OrderBook: React.FC<OrderBookProps> = ({ currentMarketPrice, onPriceSelect, asks, bids, tradeHistory }) => {
  const [activeTab, setActiveTab] = useState('Order book');

  // Calculate max total for width visualization dynamically from live data
  const maxTotalAsk = asks.reduce((max, entry) => Math.max(max, entry.total || 0), 0);
  const maxTotalBid = bids.reduce((max, entry) => Math.max(max, entry.total || 0), 0);
  const maxOverallTotal = Math.max(maxTotalAsk, maxTotalBid);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-gray-800 rounded-md p-4 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('Order book')}
            className={`font-semibold pb-1 ${activeTab === 'Order book' ? 'text-gray-200 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'}`}
          >
            Order book
          </button>
          <button
            onClick={() => setActiveTab('Trade history')}
            className={`font-semibold pb-1 ${activeTab === 'Trade history' ? 'text-gray-200 border-b-2 border-orange-500' : 'text-gray-400 hover:text-gray-200 border-b-2 border-transparent'}`}
          >
            Trade history
          </button>
        </div>
        <button className="text-gray-400 hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {activeTab === 'Order book' ? (
        <>
          <div className="flex justify-between text-gray-500 text-xs mb-2 px-1">
            <span className="w-1/3 text-left">Price(USDT)</span>
            <span className="w-1/3 text-center">Amount(BTC)</span>
            <span className="w-1/3 text-right">Total</span>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {/* Asks (Sell Orders) */}
            <div className="flex flex-col-reverse"> {/* Reverse to show highest asks at top */}
              {asks.map((entry, index) => (
                <OrderBookRow key={`ask-${entry.price}-${index}`} entry={entry} type="sell" maxTotal={maxOverallTotal} onPriceSelect={onPriceSelect} />
              ))}
            </div>

            {/* Current Market Price */}
            <div className="my-2 py-1 text-center text-2xl font-bold text-green-500">
              {currentMarketPrice.toFixed(3)}
              <span className="text-gray-500 text-sm ml-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block -mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" />
                </svg>
              </span>
            </div>

            {/* Bids (Buy Orders) */}
            <div>
              {bids.map((entry, index) => (
                <OrderBookRow key={`bid-${entry.price}-${index}`} entry={entry} type="buy" maxTotal={maxOverallTotal} onPriceSelect={onPriceSelect} />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Trade History Tab Content */
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <div className="flex justify-between text-gray-500 text-xs mb-2 px-1">
            <span className="w-1/3 text-left">Price(USDT)</span>
            <span className="w-1/3 text-center">Amount(BTC)</span>
            <span className="w-1/3 text-right">Time</span>
          </div>
          <div>
            {tradeHistory.map((trade, index) => (
              <div key={`trade-${trade.time}-${index}`} className="flex justify-between items-center py-0.5 text-xs">
                <span className={`w-1/3 text-left ${trade.buyerIsMaker ? 'text-red-400' : 'text-green-400'}`}> {/* Corrected colors */}
                  {trade.price.toFixed(2)}
                </span>
                <span className="w-1/3 text-center text-gray-300">{trade.amount.toFixed(4)}</span>
                <span className="w-1/3 text-right text-gray-400">{formatTime(trade.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderBook;