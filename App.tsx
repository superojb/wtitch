import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore, updateClockOffset, updateConnectionStatus, batchUpdateTickers, setSymbols, setSymbolMetadata, scheduleDbSync } from './store/marketStore';
import { uiStore } from './store/uiStore';
import { Header } from './components/Header';
import { TradingLayout } from './components/TradingLayout';
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
            if (flexLayoutLink) flexLayoutLink.href = "https://cdn.jsdelivr.net/npm/flexlayout-react@0.7.15/style/dark.css";
        } else {
            html.classList.remove('dark');
            if (flexLayoutLink) flexLayoutLink.href = "https://cdn.jsdelivr.net/npm/flexlayout-react@0.7.15/style/light.css";
        }
    }, [theme]);

    return null;
};

const App: React.FC = () => {
  const { connectionStatus, clockOffset } = useSnapshot(marketStore);
  const [initDb, setInitDb] = useState(false);

  // Simulate startup logic
  useEffect(() => {
    const init = async () => {
      // Simulate Database Initialization
      await db.open();
      
      // Load symbols from Dexie to Store
      const storedSymbols = await db.symbols.toArray();
      const symbolList = storedSymbols.map(s => s.symbol).sort();
      
      // Create metadata map for O(1) access
      const meta = storedSymbols.reduce((acc, curr) => {
          acc[curr.symbol] = curr;
          return acc;
      }, {} as Record<string, SymbolConfig>);

      setSymbols(symbolList);
      setSymbolMetadata(meta);
      
      setInitDb(true);

      // Simulate connection delay
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
            
            // Batch generation
            updates.push({
                symbol: 'BTCUSDT',
                lastPrice: (65000 + (Math.random() - 0.5) * 100).toString(),
                priceChangePercent: (Math.random() * 5).toFixed(2),
                volume: (Math.random() * 1000).toString(),
                quoteVolume: (Math.random() * 1000000).toString(),
                fundingRate: "0.0100"
            });
            updates.push({
                symbol: 'ETHUSDT',
                lastPrice: (3400 + (Math.random() - 0.5) * 20).toString(),
                priceChangePercent: (Math.random() * 5 - 2).toFixed(2),
                volume: (Math.random() * 5000).toString(),
                quoteVolume: (Math.random() * 500000).toString(),
                fundingRate: "0.0084"
            });
            updates.push({
                symbol: 'SOLUSDT',
                lastPrice: (145 + (Math.random() - 0.5) * 1).toString(),
                priceChangePercent: (Math.random() * 10 - 4).toFixed(2),
                volume: (Math.random() * 20000).toString(),
                quoteVolume: (Math.random() * 200000).toString(),
                fundingRate: "0.0125"
            });
            updates.push({
                symbol: 'AVAXUSDT',
                lastPrice: (35 + (Math.random() - 0.5) * 0.5).toString(),
                priceChangePercent: (Math.random() * 6 - 3).toFixed(2),
                volume: (Math.random() * 15000).toString(),
                quoteVolume: (Math.random() * 100000).toString(),
                fundingRate: "0.0050"
            });

            // Perform single batch update
            batchUpdateTickers(updates);
            
            // Trigger lazy DB sync (won't run if already scheduled)
            scheduleDbSync();
        }
    }, 500); // 500ms update rate

    return () => clearInterval(interval);
  }, []);

  if (!initDb) {
      return <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground animate-pulse font-mono text-xs">Initializing Core DB...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground">
      <ThemeManager />
      <Header />
      <main className="flex-1 overflow-hidden relative">
        <TradingLayout />
      </main>
      
      {/* Global Status Bar */}
      <footer className="h-5 bg-muted/20 border-t border-border flex items-center justify-between px-2 text-[9px] font-mono text-muted-foreground shrink-0 select-none">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className={connectionStatus === 'connected' ? 'text-emerald-500' : 'text-amber-500'}>●</span>
                <span>{connectionStatus.toUpperCase()}</span>
              </div>
              <div className="hidden sm:block">
                  <span className="opacity-50">LATENCY:</span> 24ms
              </div>
          </div>
          
          <div className="flex items-center gap-4">
               <div>
                  <span className="opacity-50">OFFSET:</span> {clockOffset}ms
               </div>
               <div>
                   <span className="opacity-50">MEM:</span> 24MB
               </div>
          </div>
      </footer>
    </div>
  );
};

export default App;