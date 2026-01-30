import { proxy } from 'valtio';
import { MarketState, ConnectionStatus, TickerData, SymbolConfig } from '../types';
import { db } from '../db/db';

export const marketStore = proxy<MarketState>({
  tickers: {},
  symbols: [],
  symbolMetadata: {},
  connectionStatus: 'disconnected',
  clockOffset: 0,
  selectedSymbol: null,
});

// Single update (Legacy/Low frequency)
export const updateTicker = (data: TickerData) => {
  marketStore.tickers[data.symbol] = data;
};

// Batch update (Optimized for High Frequency)
// This reduces the overhead of multiple function calls and allows Valtio to optimize proxy traps.
export const batchUpdateTickers = (updates: TickerData[]) => {
  const count = updates.length;
  for (let i = 0; i < count; i++) {
    const data = updates[i];
    marketStore.tickers[data.symbol] = data;
  }
};

export const setSymbols = (symbols: string[]) => {
  marketStore.symbols = symbols;
};

export const setSymbolMetadata = (metadata: Record<string, SymbolConfig>) => {
  marketStore.symbolMetadata = metadata;
};

export const updateConnectionStatus = (status: ConnectionStatus) => {
  marketStore.connectionStatus = status;
};

export const updateClockOffset = (offset: number) => {
  marketStore.clockOffset = offset;
};

export const selectSymbol = (symbol: string) => {
    marketStore.selectedSymbol = symbol;
};

// --- Lazy Persistence Layer ---
// In a HFT environment, never write to IndexedDB on every tick.
// Snapshot the memory state periodically to disk.
let dbSyncTimer: any = null;
const SYNC_INTERVAL = 5000; // 5 seconds

export const scheduleDbSync = () => {
  if (dbSyncTimer) return;
  
  dbSyncTimer = setTimeout(async () => {
    try {
       // Deep clone or extract needed state to prevent proxy issues during async op
       // For this scaffolding, we just demonstrate the hook
       // In production, we might save the last known prices to kline cache or user preferences
       dbSyncTimer = null;
    } catch (e) {
      console.error("DB Sync failed", e);
      dbSyncTimer = null;
    }
  }, SYNC_INTERVAL);
}