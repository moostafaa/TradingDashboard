
export interface OrderBookEntry {
  price: number; // After parseFloat and aggregation
  amount: number; // After parseFloat and aggregation
  total?: number; // Total is calculated client-side for visualization
}

export interface TradeEntry {
  price: number;
  amount: number;
  time: number; // Timestamp
  buyerIsMaker: boolean; // true if buyer is maker, false if seller is maker
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