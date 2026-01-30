import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore, updateClockOffset, updateConnectionStatus, batchUpdateTickers, setSymbols, setSymbolMetadata, scheduleDbSync } from './store/marketStore';
import { uiStore } from './store/uiStore';
import { Header } from './components/Header';
import { TradingLayout } from './components/TradingLayout';
import { DiagnosticOverlay } from './components/DiagnosticOverlay';
import { CommandPalette } from './components/CommandPalette';
import { GlobalContextMenu } from './components/ui/context-menu';
import { MarketTicker } from './components/MarketTicker';
import { db } from './db/db';
import { TickerData, SymbolConfig } from './types';

// Component to handle side-effects of theme switching
const ThemeManager = () => {
    const { theme } = useSnapshot(uiStore);

    useEffect(() => {
        const html = document.documentElement;
        const flexLayoutLink = document.getElementById('flexlayout-stylesheet') as HTMLLinkElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
            if (flexLayoutLink) flexLayoutLink.href = "https://cdn.jsdelivr.net/npm/flexlayout-react@0.7.15/style/dark.css";
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
            if (flexLayoutLink) flexLayoutLink.href = "https://cdn.jsdelivr.net/npm/flexlayout-react@0.7.15/style/light.css";
        }
    }, [theme]);

    return null;
};

const App: React.FC = () => {
  const { connectionStatus } = useSnapshot(marketStore);
  const [initDb, setInitDb] = useState(false);

  // Simulate startup logic
  useEffect(() => {
    const init = async () => {
      await db.open();
      const storedSymbols = await db.symbols.toArray();
      const symbolList = storedSymbols.map(s => s.symbol).sort();
      
      const meta = storedSymbols.reduce((acc, curr) => {
          acc[curr.symbol] = curr;
          return acc;
      }, {} as Record<string, SymbolConfig>);

      setSymbols(symbolList);
      setSymbolMetadata(meta);
      setInitDb(true);

      updateConnectionStatus('connecting');
      setTimeout(() => {
        updateConnectionStatus('connected');
        updateClockOffset(-50); 
      }, 800);
    };

    init();

    // Mock Websocket Data Feed
    const interval = setInterval(() => {
        if (marketStore.connectionStatus === 'connected') {
            const updates: TickerData[] = [];
            const syms = marketStore.symbols.length > 0 ? marketStore.symbols : ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'AVAXUSDT'];
            syms.forEach(sym => {
                updates.push({
                    symbol: sym,
                    lastPrice: (Math.random() * 1000).toFixed(2),
                    priceChangePercent: (Math.random() * 10 - 5).toFixed(2),
                    volume: (Math.random() * 10000).toString(),
                    quoteVolume: (Math.random() * 1000000).toString(),
                    fundingRate: "0.0100"
                });
            });
            batchUpdateTickers(updates);
            scheduleDbSync();
        }
    }, 500); 

    return () => clearInterval(interval);
  }, []);

  if (!initDb) {
      return <div className="flex h-full w-full items-center justify-center bg-vx-bg text-vx-text-primary animate-pulse font-mono text-xs">KERNEL INITIALIZING...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-vx-bg text-vx-text-primary overflow-hidden">
      <ThemeManager />
      <Header />
      <main className="flex-1 overflow-hidden relative">
        <TradingLayout />
      </main>
      
      {/* Footer: Market Ticker + Status */}
      <footer className="h-6 bg-vx-bg border-t border-vx-border flex items-center justify-between shrink-0 select-none overflow-hidden relative z-50">
          <div className="w-[85px] flex items-center justify-center h-full bg-vx-surface border-r border-vx-border shrink-0">
             <span className={connectionStatus === 'connected' ? 'text-vx-up text-[9px] font-bold' : 'text-vx-down text-[9px] font-bold'}>
                {connectionStatus.toUpperCase()}
             </span>
          </div>

          <MarketTicker />
      </footer>
      
      <CommandPalette />
      <GlobalContextMenu />
      <DiagnosticOverlay />
    </div>
  );
};

export default App;