
import { Position } from './types';

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