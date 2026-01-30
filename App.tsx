import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore, updateClockOffset, updateConnectionStatus, updateTicker, setSymbols } from './store/marketStore';
import { Header } from './components/Header';
import { TradingLayout } from './components/TradingLayout';
import { db } from './db/db';

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
      setSymbols(symbolList);
      
      setInitDb(true);

      // Simulate connection delay
      updateConnectionStatus('connecting');
      setTimeout(() => {
        updateConnectionStatus('connected');
        // Simulate clock synchronization
        updateClockOffset(Date.now() - new Date().getTime() - 50); // -50ms drift
      }, 800);
    };

    init();

    // Mock Websocket Data Feed
    const interval = setInterval(() => {
        if (marketStore.connectionStatus === 'connected') {
            updateTicker({
                symbol: 'BTCUSDT',
                lastPrice: (65000 + (Math.random() - 0.5) * 100).toString(),
                priceChangePercent: (Math.random() * 5).toFixed(2),
                volume: (Math.random() * 1000).toString(),
                quoteVolume: (Math.random() * 1000000).toString(),
                fundingRate: "0.0100"
            });
            updateTicker({
                symbol: 'ETHUSDT',
                lastPrice: (3400 + (Math.random() - 0.5) * 20).toString(),
                priceChangePercent: (Math.random() * 5 - 2).toFixed(2),
                volume: (Math.random() * 5000).toString(),
                quoteVolume: (Math.random() * 500000).toString(),
                fundingRate: "0.0084"
            });
             updateTicker({
                symbol: 'SOLUSDT',
                lastPrice: (145 + (Math.random() - 0.5) * 1).toString(),
                priceChangePercent: (Math.random() * 10 - 4).toFixed(2),
                volume: (Math.random() * 20000).toString(),
                quoteVolume: (Math.random() * 200000).toString(),
                fundingRate: "0.0125"
            });
             updateTicker({
                symbol: 'AVAXUSDT',
                lastPrice: (35 + (Math.random() - 0.5) * 0.5).toString(),
                priceChangePercent: (Math.random() * 6 - 3).toFixed(2),
                volume: (Math.random() * 15000).toString(),
                quoteVolume: (Math.random() * 100000).toString(),
                fundingRate: "0.0050"
            });
        }
    }, 500); // Faster updates to test flashing

    return () => clearInterval(interval);
  }, []);

  if (!initDb) {
      return <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground animate-pulse">Initializing Core DB...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden relative">
        <TradingLayout />
      </main>
      
      {/* Global Status Bar */}
      <footer className="h-6 bg-muted/40 border-t border-border flex items-center justify-between px-2 text-[10px] font-mono text-muted-foreground shrink-0 select-none">
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