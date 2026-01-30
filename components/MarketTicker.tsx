import React, { memo, useRef } from 'react';
import { useSnapshot } from 'valtio';
import { marketStore, selectSymbol } from '../store/marketStore';
import { cn } from '../lib/utils';
import { TickerData } from '../types';

const TickerItem = memo(({ symbol, data }: { symbol: string, data: TickerData }) => {
    const prevPrice = useRef(data.lastPrice);
    const dir = useRef<'up' | 'down' | null>(null);

    // Flash Logic
    if (data.lastPrice !== prevPrice.current) {
        const curr = parseFloat(data.lastPrice);
        const prev = parseFloat(prevPrice.current);
        if (curr > prev) dir.current = 'up';
        else if (curr < prev) dir.current = 'down';
        prevPrice.current = data.lastPrice;
    }

    const animClass = dir.current === 'up' ? 'animate-flash-up' : dir.current === 'down' ? 'animate-flash-down' : '';
    const pct = parseFloat(data.priceChangePercent);
    const textCol = pct > 0 ? 'text-vx-up' : pct < 0 ? 'text-vx-down' : 'text-vx-text-secondary';

    return (
        <div 
            onClick={() => selectSymbol(symbol)}
            className={cn(
                "flex items-center gap-3 px-4 h-full cursor-pointer border-r border-vx-border shrink-0 transition-colors hover:bg-vx-surface",
                animClass
            )}
        >
            <span className="font-bold text-[10px] text-vx-text-primary">{symbol}</span>
            <div className="flex gap-2 font-mono text-[10px]">
                <span className="text-vx-text-primary tabular-nums">
                    {parseFloat(data.lastPrice).toFixed(2)}
                </span>
                <span className={cn("tabular-nums", textCol)}>
                    {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
                </span>
            </div>
        </div>
    )
});

export const MarketTicker: React.FC = () => {
    const { symbols, tickers } = useSnapshot(marketStore);

    return (
        <div className="flex-1 flex items-center overflow-x-auto overflow-y-hidden whitespace-nowrap h-full bg-vx-bg scrollbar-none">
            {symbols.map(sym => (
                <TickerItem 
                    key={sym} 
                    symbol={sym} 
                    data={tickers[sym] || { symbol: sym, lastPrice: '0.00', priceChangePercent: '0.00' } as any}
                />
            ))}
        </div>
    );
};