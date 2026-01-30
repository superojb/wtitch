export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export interface TickerData {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  fundingRate: string;
}

export interface MarketState {
  tickers: Record<string, TickerData>;
  symbols: string[]; // Ordered list of available symbols
  connectionStatus: ConnectionStatus;
  clockOffset: number; // Time difference in ms between client and server
  selectedSymbol: string | null;
}

export interface SymbolConfig {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    tickSize: string; // "0.01"
    stepSize: string; // "0.0001"
}

// Dexie Types
export interface Kline {
    symbol: string;
    openTime: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    closeTime: number;
}