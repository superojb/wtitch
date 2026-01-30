import Dexie, { Table } from 'dexie';
import { Kline, SymbolConfig } from '../types';

export class SwayVexDB extends Dexie {
  symbols!: Table<SymbolConfig, string>; // Primary key is symbol string
  klines!: Table<Kline, [string, number]>; // Composite key: [symbol, openTime]

  constructor() {
    super('SwayVexDB');
    // Cast to any to bypass TS error regarding version method on subclass
    (this as any).version(1).stores({
      symbols: 'symbol, baseAsset, quoteAsset',
      klines: '[symbol+openTime], symbol, openTime'
    });
  }

  // Explicitly expose open method to satisfy TS inference in App.tsx
  open() {
    return super.open();
  }
}

export const db = new SwayVexDB();

// Pre-populate with dummy data if empty (for scaffolding purposes)
// Cast to any to bypass TS error regarding on method
(db as any).on('populate', () => {
  db.symbols.bulkAdd([
    { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', tickSize: '0.01', stepSize: '0.00001' },
    { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', tickSize: '0.01', stepSize: '0.0001' },
    { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', tickSize: '0.01', stepSize: '0.01' },
    { symbol: 'AVAXUSDT', baseAsset: 'AVAX', quoteAsset: 'USDT', tickSize: '0.01', stepSize: '0.1' },
  ]);
});