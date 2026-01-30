import React, { memo, useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useSnapshot } from 'valtio';
import * as ReactWindowNamespace from 'react-window';
import { marketStore, selectSymbol } from '../store/marketStore';
import { cn } from '../lib/utils';
import { TickerData } from '../types';

// Robust ESM Interop
const ReactWindow = ReactWindowNamespace as any;
const FixedSizeList = ReactWindow.FixedSizeList || ReactWindow.default?.FixedSizeList;

// --- Flash Price Cell (Zero-JS Animation) ---
// We use the `key` prop on the span. When the price string changes, React unmounts the old span
// and mounts a new one. The new span has the CSS animation class applied immediately.
const PriceCell = memo(({ price }: { price: string }) => {
  const prevPrice = useRef(price);
  const dir = useRef<'up' | 'down' | null>(null);

  if (price !== prevPrice.current) {
    const curr = parseFloat(price);
    const prev = parseFloat(prevPrice.current);
    if (curr > prev) dir.current = 'up';
    else if (curr < prev) dir.current = 'down';
    prevPrice.current = price;
  }

  const animClass = dir.current === 'up' ? 'animate-flash-up' : dir.current === 'down' ? 'animate-flash-down' : '';

  return (
    <div className="text-right font-mono text-[11px] leading-6">
      <span key={price} className={cn("px-1 rounded-sm", animClass)}>
        {parseFloat(price).toFixed(2)}
      </span>
    </div>
  );
});

// --- Row Component ---
const Row = memo(({ index, style, data }: any) => {
  const symbol = data[index];
  const snap = useSnapshot(marketStore);
  const ticker = snap.tickers[symbol] as TickerData | undefined;
  const isSelected = snap.selectedSymbol === symbol;

  if (!ticker) return <div style={style} className="flex items-center px-2 text-[10px] text-muted-foreground">Loading...</div>;

  const pct = parseFloat(ticker.priceChangePercent);
  const pctColor = pct > 0 ? 'text-emerald-500' : pct < 0 ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div 
      style={style} 
      className={cn(
        "flex items-center px-2 border-b border-border hover:bg-accent/50 cursor-pointer select-none transition-colors",
        isSelected ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
      onClick={() => selectSymbol(symbol)}
    >
      <div className="w-[40%] font-bold text-[11px] text-foreground">{symbol}</div>
      <div className="w-[35%]">
        <PriceCell price={ticker.lastPrice} />
      </div>
      <div className={cn("w-[25%] text-right font-mono text-[11px]", pctColor)}>
        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
      </div>
    </div>
  );
});

// --- Market Watch Container ---
export const MarketOverview: React.FC = () => {
  const { symbols } = useSnapshot(marketStore);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (symbols.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">CONNECTING FEED...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col bg-card">
      {/* Static Header */}
      <div className="flex items-center px-2 h-6 bg-muted border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
        <div className="w-[40%]">Symbol</div>
        <div className="w-[35%] text-right">Price</div>
        <div className="w-[25%] text-right">24h%</div>
      </div>
      
      {/* Virtual List */}
      <div className="flex-1 w-full" ref={containerRef}>
        {size.h > 0 && FixedSizeList && (
          <FixedSizeList
            height={size.h}
            width={size.w}
            itemCount={symbols.length}
            itemSize={24} // Compact row height
            itemData={symbols}
            className="scrollbar-hide"
          >
            {Row}
          </FixedSizeList>
        )}
      </div>
    </div>
  );
};