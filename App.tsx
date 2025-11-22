
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import TradingPairInfo from './components/TradingPairInfo';
import TradingViewChart from './components/TradingViewChart';
import OrderBook from './components/OrderBook';
import TradingPanel from './components/TradingPanel';
import PositionsTable from './components/PositionsTable';
import { OrderBookEntry, TradeEntry } from './types';

const INITIAL_AVAILABLE_FUNDS = 10000;
const MAX_TRADE_HISTORY_ITEMS = 20; // Limit trade history to the last 20 items as requested

const App: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercentage, setPriceChangePercentage] = useState(0);
  const [high24h, setHigh24h] = useState(0);
  const [low24h, setLow24h] = useState(0);
  const [volumeBTC, setVolumeBTC] = useState(0);
  const [volumeUSDT, setVolumeUSDT] = useState(0);

  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeEntry[]>([]);

  const [selectedOrderPrice, setSelectedOrderPrice] = useState<number | null>(null);
  const [availableFunds] = useState<number>(INITIAL_AVAILABLE_FUNDS); // availableFunds currently not directly editable in UI

  const tickerWsRef = useRef<WebSocket | null>(null);
  const depthWsRef = useRef<WebSocket | null>(null);
  const tradeWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectTickerWs = () => {
      if (tickerWsRef.current && tickerWsRef.current.readyState === WebSocket.OPEN) {
        return;
      }
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
      tickerWsRef.current = ws;

      ws.onopen = () => console.log('Ticker WebSocket Connected');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setCurrentPrice(parseFloat(data.c));
        setPriceChange(parseFloat(data.p));
        setPriceChangePercentage(parseFloat(data.P));
        setHigh24h(parseFloat(data.h));
        setLow24h(parseFloat(data.l));
        setVolumeBTC(parseFloat(data.v));
        setVolumeUSDT(parseFloat(data.q));
      };
      ws.onerror = (errorEvent) => {
        const error = errorEvent as ErrorEvent; // Type assertion
        console.error('Ticker WebSocket Error:', error.message || 'Unknown error', error);
      };
      ws.onclose = () => {
        console.log('Ticker WebSocket Closed, attempting to reconnect...');
        setTimeout(connectTickerWs, 3000); // Reconnect after 3 seconds
      };
    };

    const connectDepthWs = () => {
      if (depthWsRef.current && depthWsRef.current.readyState === WebSocket.OPEN) {
        return;
      }
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@depth20@100ms');
      depthWsRef.current = ws;

      ws.onopen = () => console.log('Depth WebSocket Connected');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Aggregate bids to integer prices
        const aggregatedBidsMap = new Map<number, number>();
        data.bids.forEach((b: [string, string]) => {
          const rawPrice = parseFloat(b[0]);
          const rawAmount = parseFloat(b[1]);
          // Round down to nearest integer for bids
          const roundedPrice = Math.floor(rawPrice); 
          aggregatedBidsMap.set(roundedPrice, (aggregatedBidsMap.get(roundedPrice) || 0) + rawAmount);
        });

        let currentTotalBid = 0;
        const processedBids: OrderBookEntry[] = Array.from(aggregatedBidsMap.entries())
          .sort((a, b) => b[0] - a[0]) // Sort descending by price for bids
          .map(([price, amount]) => {
            currentTotalBid += amount;
            return { price, amount, total: currentTotalBid };
          });
        setBids(processedBids);

        // Aggregate asks to integer prices
        const aggregatedAsksMap = new Map<number, number>();
        data.asks.forEach((a: [string, string]) => {
          const rawPrice = parseFloat(a[0]);
          const rawAmount = parseFloat(a[1]);
          // Round up to nearest integer for asks
          const roundedPrice = Math.ceil(rawPrice); 
          aggregatedAsksMap.set(roundedPrice, (aggregatedAsksMap.get(roundedPrice) || 0) + rawAmount);
        });
        
        let currentTotalAsk = 0;
        const processedAsks: OrderBookEntry[] = Array.from(aggregatedAsksMap.entries())
          .sort((a, b) => a[0] - b[0]) // Sort ascending by price for asks
          .map(([price, amount]) => {
            currentTotalAsk += amount;
            return { price, amount, total: currentTotalAsk };
          });
        setAsks(processedAsks);
      };
      ws.onerror = (errorEvent) => {
        const error = errorEvent as ErrorEvent; // Type assertion
        console.error('Depth WebSocket Error:', error.message || 'Unknown error', error);
      };
      ws.onclose = () => {
        console.log('Depth WebSocket Closed, attempting to reconnect...');
        setTimeout(connectDepthWs, 3000); // Reconnect after 3 seconds
      };
    };

    const connectTradeWs = () => {
      if (tradeWsRef.current && tradeWsRef.current.readyState === WebSocket.OPEN) {
        return;
      }
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
      tradeWsRef.current = ws;

      ws.onopen = () => console.log('Trade WebSocket Connected');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const newTrade: TradeEntry = {
          price: parseFloat(data.p),
          amount: parseFloat(data.q),
          time: data.T, // Trade time
          buyerIsMaker: data.m, // true if buyer is maker (sell order), false if seller is maker (buy order)
        };
        setTradeHistory((prevHistory) => {
          const updatedHistory = [newTrade, ...prevHistory];
          return updatedHistory.slice(0, MAX_TRADE_HISTORY_ITEMS); // Keep only the latest N trades
        });
      };
      ws.onerror = (errorEvent) => {
        const error = errorEvent as ErrorEvent; // Type assertion
        console.error('Trade WebSocket Error:', error.message || 'Unknown error', error);
      };
      ws.onclose = () => {
        console.log('Trade WebSocket Closed, attempting to reconnect...');
        setTimeout(connectTradeWs, 3000); // Reconnect after 3 seconds
      };
    };

    connectTickerWs();
    connectDepthWs();
    connectTradeWs(); 

    return () => {
      tickerWsRef.current?.close();
      depthWsRef.current?.close();
      tradeWsRef.current?.close(); 
    };
  }, []); 


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="p-4 pb-0">
        <TradingPairInfo
          currentPrice={currentPrice}
          priceChange={priceChange}
          priceChangePercentage={priceChangePercentage}
          high24h={high24h}
          low24h={low24h}
          volumeBTC={volumeBTC}
          volumeUSDT={volumeUSDT}
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
          <OrderBook
            currentMarketPrice={currentPrice}
            onPriceSelect={setSelectedOrderPrice}
            asks={asks}
            bids={bids}
            tradeHistory={tradeHistory} 
          />
        </div>

        {/* Trading Panel - spans 1 column in the first row */}
        <div className="xl:col-span-1 xl:row-start-1 h-full">
          <TradingPanel
            selectedPriceFromOrderBook={selectedOrderPrice}
            availableFunds={availableFunds}
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