import React, { memo, useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useSnapshot } from 'valtio';
import * as ReactWindow from 'react-window';
import { marketStore, selectSymbol } from '../store/marketStore';
import { BigFormatter } from '../services/bigFormatter';
import { cn } from '../lib/utils';
import { TickerData } from '../types';

// Safe access to FixedSizeList and areEqual from the module namespace
const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || ReactWindow.default;
const safeAreEqual = (ReactWindow as any).areEqual || (ReactWindow as any).default?.areEqual || ((prev: any, next: any) => prev === next);

// --- Price Cell Component for Flash Effect ---
const PriceCell = memo(({ value }: { value: string }) => {
  const prevValue = useRef(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (value !== prevValue.current) {
      const current = parseFloat(value);
      const prev = parseFloat(prevValue.current);
      if (current > prev) setFlash('up');
      else if (current < prev) setFlash('down');
      
      prevValue.current = value;

      const timer = setTimeout(() => setFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const textColor = flash === 'up' 
    ? 'text-emerald-500 bg-emerald-500/10' 
    : flash === 'down' 
      ? 'text-red-500 bg-red-500/10' 
      : 'text-foreground';

  return (
    <div className={cn("text-right font-mono transition-colors duration-200 px-1 rounded-sm", textColor)}>
      {BigFormatter.formatPrice(value, "0.01")}
    </div>
  );
});

// --- Row Component ---
const Row = memo(({ index, style, data }: any) => {
  const symbol = data[index];
  const snap = useSnapshot(marketStore);
  const ticker = snap.tickers[symbol] as TickerData | undefined;
  const isSelected = snap.selectedSymbol === symbol;

  const handleSelect = () => {
    selectSymbol(symbol);
  };

  if (!ticker) {
    return (
      <div style={style} className="flex items-center px-2 text-[10px] text-muted-foreground border-b border-border/40">
        <span className="w-16 font-bold">{symbol}</span>
        <span className="flex-1 text-center">Loading...</span>
      </div>
    );
  }

  const change = parseFloat(ticker.priceChangePercent);
  const changeColor = change >= 0 ? 'text-emerald-500' : 'text-red-500';

  return (
    <div 
      style={style} 
      onClick={handleSelect}
      className={cn(
        "flex items-center text-[11px] border-b border-border/40 hover:bg-accent/50 cursor-pointer transition-colors px-1",
        isSelected && "bg-accent hover:bg-accent"
      )}
    >
      <div className="w-[28%] font-bold text-foreground truncate pl-1" title={symbol}>{symbol}</div>
      <div className="w-[22%]">
         <PriceCell value={ticker.lastPrice} />
      </div>
      <div className={cn("w-[18%] text-right font-mono", changeColor)}>
        {ticker.priceChangePercent}%
      </div>
      <div className="w-[18%] text-right font-mono text-muted-foreground">
        {BigFormatter.formatVolume(ticker.volume)}
      </div>
      <div className="w-[14%] text-right font-mono text-amber-500/80 pr-1">
        {ticker.fundingRate}%
      </div>
    </div>
  );
}, safeAreEqual);

// --- Header Component ---
const MarketHeader = () => (
  <div className="flex items-center px-1 h-6 text-[10px] font-semibold text-muted-foreground bg-muted/20 border-b border-border shrink-0 select-none">
    <div className="w-[28%] pl-1">Symbol</div>
    <div className="w-[22%] text-right">Price</div>
    <div className="w-[18%] text-right">24h%</div>
    <div className="w-[18%] text-right">Vol</div>
    <div className="w-[14%] text-right pr-1">Fund</div>
  </div>
);

// --- Hook for container sizing ---
const useContainerSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    
    // ResizeObserver is more robust for FlexLayout resizing events
    const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
            setSize({
                width: entry.contentRect.width,
                height: entry.contentRect.height
            });
        }
    });

    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, []);

  return { ref, size };
};

// --- Main Container ---
export const MarketOverview: React.FC = () => {
  const snap = useSnapshot(marketStore);
  const symbols = snap.symbols;
  const { ref, size } = useContainerSize();

  if (symbols.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
        Loading Assets...
      </div>
    );
  }

  // Fallback if List isn't loaded correctly
  if (!List) {
      return <div className="p-2 text-[10px] text-red-500">Failed to load virtual list.</div>
  }

  return (
    <div className="h-full w-full flex flex-col bg-card">
      <MarketHeader />
      <div className="flex-1 w-full overflow-hidden relative" ref={ref}>
        {size.height > 0 && size.width > 0 && (
            <List
              height={size.height}
              itemCount={symbols.length}
              itemSize={24} 
              width={size.width}
              itemData={symbols}
              className="scrollbar-hide"
            >
              {Row}
            </List>
        )}
      </div>
    </div>
  );
};