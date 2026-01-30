import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore, updateClockOffset, updateConnectionStatus, batchUpdateTickers, setSymbols, setSymbolMetadata, scheduleDbSync } from './store/marketStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { TradingLayout } from './components/TradingLayout';
import { SystemIsland } from './components/SystemIsland';
import { DiagnosticOverlay } from './components/DiagnosticOverlay';
import { CommandPalette } from './components/CommandPalette';
import { GlobalContextMenu } from './components/ui/context-menu';
import { MarketTicker } from './components/MarketTicker';
import { db } from './db/db';
import { TickerData, SymbolConfig } from './types';

const App: React.FC = () => {
  const [initDb, setInitDb] = useState(false);

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
        updateClockOffset(-42); 
      }, 800);
    };

    init();

    // Data Feed Simulation
    const interval = setInterval(() => {
        if (marketStore.connectionStatus === 'connected') {
            const updates: TickerData[] = [];
            const syms = marketStore.symbols.length > 0 ? marketStore.symbols : ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'AVAXUSDT', 'BNBUSDT', 'ADAUSDT'];
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
      return <div className="flex h-screen w-screen items-center justify-center bg-black text-white font-mono text-xs tracking-widest animate-pulse">BOOTSTRAPPING CRYSTAL ENGINE...</div>;
  }

  return (
    <ThemeProvider>
        <div className="h-screen w-screen overflow-hidden relative selection:bg-vx-accent selection:text-white">
            {/* Background Ambient Layers */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>
            
            {/* System UI Layer (Top) */}
            <Header />
            <SystemIsland />
            
            {/* Main Workspace */}
            <main className="absolute inset-0 z-10">
                <TradingLayout />
            </main>
            
            {/* Floating Dock Layer (Bottom) */}
            <MarketTicker />
            
            {/* Overlays */}
            <CommandPalette />
            <GlobalContextMenu />
            <DiagnosticOverlay />
        </div>
    </ThemeProvider>
  );
};

export default App;