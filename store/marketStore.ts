import { proxy } from 'valtio';
import { MarketState, ConnectionStatus, TickerData } from '../types';

export const marketStore = proxy<MarketState>({
  tickers: {},
  symbols: [],
  connectionStatus: 'disconnected',
  clockOffset: 0,
  selectedSymbol: null,
});

export const updateTicker = (data: TickerData) => {
  marketStore.tickers[data.symbol] = data;
};

export const setSymbols = (symbols: string[]) => {
  marketStore.symbols = symbols;
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