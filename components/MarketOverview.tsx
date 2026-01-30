import React, { memo, useRef, useLayoutEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import * as ReactWindowNamespace from 'react-window';
import { marketStore, selectSymbol } from '../store/marketStore';
import { openContextMenu } from '../store/uiStore';
import { cn } from '../lib/utils';
import { TickerData } from '../types';
import { ChevronRight } from 'lucide-react';

// Robust ESM Interop
const ReactWindow = ReactWindowNamespace as any;
const FixedSizeList = ReactWindow.FixedSizeList || ReactWindow.default?.FixedSizeList;

// --- Flash Price Cell (Zero-JS Animation) ---
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
    <div className="text-right font-mono tabular-nums text-[11px] leading-6 text-slate-100">
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

  if (!ticker) return <div style={style} className="flex items-center px-2 text-[10px] text-muted-foreground">...</div>;

  const pct = parseFloat(ticker.priceChangePercent);
  const pctColor = pct > 0 ? 'text-emerald-500' : pct < 0 ? 'text-red-500' : 'text-slate-400';

  const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      // Select symbol on right click too
      selectSymbol(symbol);
      openContextMenu(e.clientX, e.clientY, symbol);
  };

  return (
    <div 
      style={style} 
      className={cn(
        "group flex items-center px-2 border-b border-border hover:bg-slate-900 cursor-pointer select-none transition-colors",
        isSelected ? "bg-slate-900 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
      )}
      onClick={() => selectSymbol(symbol)}
      onContextMenu={handleContextMenu}
    >
      <div className="w-[35%] flex items-center gap-2">
        <span className={cn("font-bold text-[11px] transition-colors", isSelected ? "text-primary" : "text-slate-100 group-hover:text-white")}>
            {symbol.replace('USDT', '')}
        </span>
        <span className="text-[9px] text-slate-600 font-medium">USDT</span>
      </div>
      
      <div className="w-[30%]">
        <PriceCell price={ticker.lastPrice} />
      </div>
      
      <div className={cn("w-[25%] text-right font-mono tabular-nums text-[10px]", pctColor)}>
        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
      </div>

      {/* Contextual Action: Only visible on hover */}
      <div className="w-[10%] flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
         <button 
            className="h-4 w-4 flex items-center justify-center rounded hover:bg-primary/20 text-primary"
            onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e);
            }}
         >
            <ChevronRight className="h-3 w-3" />
         </button>
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
    return <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-500 font-mono">WAITING_FOR_FEED</div>;
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-950">
      {/* Compact Header */}
      <div className="flex items-center px-2 h-5 bg-slate-950 border-b border-border text-[9px] font-bold text-slate-500 uppercase tracking-widest shrink-0">
        <div className="w-[35%]">Ticker</div>
        <div className="w-[30%] text-right">Price</div>
        <div className="w-[25%] text-right">24h %</div>
        <div className="w-[10%]"></div>
      </div>
      
      {/* Virtual List */}
      <div className="flex-1 w-full" ref={containerRef}>
        {size.h > 0 && FixedSizeList && (
          <FixedSizeList
            height={size.h}
            width={size.w}
            itemCount={symbols.length}
            itemSize={24} // Keep row height accessible
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