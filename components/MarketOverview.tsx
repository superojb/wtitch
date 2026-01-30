import React, { memo, useRef, useLayoutEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import * as ReactWindowNamespace from 'react-window';
import Big from 'big.js'; 
import { marketStore, selectSymbol } from '../store/marketStore';
import { BigFormatter } from '../services/bigFormatter';
import { cn } from '../lib/utils';
import { TickerData } from '../types';

// Robust ESM/CJS interop for react-window
const ReactWindow = ReactWindowNamespace as any;
// Ensure we get the actual component class/function, not the module object
const List = ReactWindow.FixedSizeList || ReactWindow.default?.FixedSizeList;
const safeAreEqual = ReactWindow.areEqual || ReactWindow.default?.areEqual || ((prev: any, next: any) => prev === next);

// --- Price Cell Component with Low-CPU Flash ---
const PriceCell = memo(({ value, tickSize }: { value: string, tickSize: string }) => {
  const prevValue = useRef(value);
  const directionRef = useRef<'up' | 'down' | null>(null);

  // Synchronous calculation before render to determine direction
  if (value !== prevValue.current) {
      try {
          const current = new Big(value);
          const prev = new Big(prevValue.current);
          if (current.gt(prev)) directionRef.current = 'up';
          else if (current.lt(prev)) directionRef.current = 'down';
      } catch(e) {}
      prevValue.current = value;
  }

  const animClass = directionRef.current === 'up' 
    ? 'animate-flash-up' 
    : directionRef.current === 'down' 
      ? 'animate-flash-down' 
      : '';

  return (
    <div className="text-right font-mono px-1 rounded-sm">
      <span key={value} className={cn("inline-block", animClass)}>
        {BigFormatter.formatPrice(value, tickSize)}
      </span>
    </div>
  );
});

// --- Row Component ---
const Row = memo(({ index, style, data }: any) => {
  const symbol = data[index];
  const snap = useSnapshot(marketStore);
  const ticker = snap.tickers[symbol] as TickerData | undefined;
  const meta = snap.symbolMetadata[symbol];
  const tickSize = meta?.tickSize || "0.01"; 
  
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

  let changeColor = 'text-foreground';
  try {
      const change = new Big(ticker.priceChangePercent);
      if (change.gt(0)) changeColor = 'text-emerald-500';
      else if (change.lt(0)) changeColor = 'text-red-500';
  } catch(e) { /* ignore */ }

  return (
    <div 
      style={style} 
      onClick={handleSelect}
      className={cn(
        "flex items-center text-[10px] border-b border-border/20 hover:bg-accent/50 cursor-pointer transition-colors px-1",
        isSelected && "bg-accent hover:bg-accent"
      )}
    >
      <div className="w-[28%] font-bold text-foreground truncate pl-1" title={symbol}>{symbol}</div>
      <div className="w-[22%]">
         <PriceCell value={ticker.lastPrice} tickSize={tickSize} />
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
  <div className="flex items-center px-1 h-5 text-[9px] font-semibold text-muted-foreground bg-muted/20 border-b border-border shrink-0 select-none uppercase tracking-wider">
    <div className="w-[28%] pl-1">Asset</div>
    <div className="w-[22%] text-right">Last</div>
    <div className="w-[18%] text-right">24h%</div>
    <div className="w-[18%] text-right">Vol</div>
    <div className="w-[14%] text-right pr-1">Rate</div>
  </div>
);

// --- Hook for container sizing ---
const useContainerSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
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

  if (!List) {
      return <div className="p-2 text-[10px] text-red-500">Failed to load virtual list. Library resolution error.</div>
  }

  return (
    <div className="h-full w-full flex flex-col bg-card">
      <MarketHeader />
      <div className="flex-1 w-full overflow-hidden relative" ref={ref}>
        {size.height > 0 && size.width > 0 && (
            <List
              height={size.height}
              itemCount={symbols.length}
              itemSize={22} 
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