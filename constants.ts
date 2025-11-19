import { ChartDataPoint, OrderBookEntry, Position } from './types';

export const INITIAL_MARKET_PRICE = 95510.405;
export const INITIAL_AVAILABLE_FUNDS = 10000; // Mock initial available funds in USDT

// Mock data generation for chart
const generateChartData = (numPoints: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let currentPrice = INITIAL_MARKET_PRICE;
  let currentVolume = 10000;

  for (let i = 0; i < numPoints; i++) {
    const date = new Date();
    date.setDate(date.getDate() - numPoints + i);
    const time = date.toLocaleString('en-US', { month: 'short', day: 'numeric' });

    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * 1000;
    const high = Math.max(open, close) + Math.random() * 500;
    const low = Math.min(open, close) - Math.random() * 500;
    const volume = currentVolume + (Math.random() - 0.5) * 5000;

    currentPrice = close;
    currentVolume = volume;

    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: parseFloat(volume.toFixed(2)),
    });
  }
  return data;
};

export const MOCK_CHART_DATA: ChartDataPoint[] = generateChartData(90);

// Mock data generation for order book (bids and asks)
const generateOrderBook = (centerPrice: number, numEntries: number): { asks: OrderBookEntry[]; bids: OrderBookEntry[] } => {
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];
  let currentTotalAsk = 0;
  let currentTotalBid = 0;

  for (let i = 0; i < numEntries; i++) {
    const askPrice = centerPrice + (i + 1) * 0.1 * (Math.random() * 0.5 + 0.5);
    const bidPrice = centerPrice - (i + 1) * 0.1 * (Math.random() * 0.5 + 0.5);
    const amountAsk = parseFloat((Math.random() * 5).toFixed(2));
    const amountBid = parseFloat((Math.random() * 5).toFixed(2));

    currentTotalAsk += amountAsk;
    currentTotalBid += amountBid;

    asks.unshift({ // Add to beginning for ascending prices
      price: parseFloat(askPrice.toFixed(1)),
      amount: amountAsk,
      total: parseFloat(currentTotalAsk.toFixed(2)),
    });
    bids.push({ // Add to end for descending prices
      price: parseFloat(bidPrice.toFixed(1)),
      amount: amountBid,
      total: parseFloat(currentTotalBid.toFixed(2)),
    });
  }
  return { asks, bids };
};

export const MOCK_ORDER_BOOK = generateOrderBook(INITIAL_MARKET_PRICE, 10);

export const MOCK_POSITIONS: Position[] = [
  {
    pair: 'BTC/USDT',
    size: 0.92,
    margin: 353.22,
    entryPrice: 96343.4,
    markPrice: 95432.52,
    mmr: 3.83,
    unrealizedPNL: 89.45,
    unrealizedPNLPercentage: 59,
    type: 'Long',
    leverage: '10X',
  },
  {
    pair: 'ETH/USDT',
    size: 5.10,
    margin: 150.00,
    entryPrice: 1800.23,
    markPrice: 1805.10,
    mmr: 2.10,
    unrealizedPNL: 25.15,
    unrealizedPNLPercentage: 15,
    type: 'Long',
    leverage: '5X',
  },
  {
    pair: 'XRP/USDT',
    size: 1500.00,
    margin: 50.00,
    entryPrice: 0.5200,
    markPrice: 0.5180,
    mmr: 1.50,
    unrealizedPNL: -3.00,
    unrealizedPNLPercentage: -6,
    type: 'Short',
    leverage: '20X',
  },
];