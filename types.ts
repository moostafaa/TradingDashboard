export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface Position {
  pair: string;
  size: number;
  margin: number;
  entryPrice: number;
  markPrice: number;
  mmr: number;
  unrealizedPNL: number;
  unrealizedPNLPercentage: number;
  type: 'Long' | 'Short';
  leverage: string;
}