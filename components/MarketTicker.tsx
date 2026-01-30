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

    const pct = parseFloat(data.priceChangePercent);
    const isUp = pct >= 0;
    
    // Animation classes applied to the background layer only
    const flashClass = dir.current === 'up' ? 'animate-flash-up' : 
                       dir.current === 'down' ? 'animate-flash-down' : '';

    return (
        <div 
            onClick={() => selectSymbol(symbol)}
            className="group/item relative flex-shrink-0 flex flex-col justify-center w-[120px] h-[48px] px-3 mx-1 cursor-pointer transition-colors hover:bg-vx-surface/50 rounded-md"
            onAnimationEnd={() => dir.current = null}
        >
            {/* Flash Layer */}
            <div className={cn(
                "absolute inset-0 rounded-md bg-transparent transition-colors",
                flashClass
            )} />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-vx-text-primary group-hover/item:text-vx-accent transition-colors">
                        {symbol.replace('USDT','')}
                    </span>
                    <span className={cn("text-[9px] font-mono", isUp ? "text-vx-up" : "text-vx-down")}>
                        {pct.toFixed(2)}%
                    </span>
                </div>
                <div className="flex justify-between items-baseline">
                    <span className="font-mono text-[11px] font-medium text-vx-text-secondary tracking-tight">
                        {parseFloat(data.lastPrice).toFixed(2)}
                    </span>
                </div>
            </div>
            
            {/* Divider */}
            <div className="absolute right-0 top-3 bottom-3 w-[1px] bg-vx-border opacity-50" />
        </div>
    )
});

export const MarketTicker: React.FC = () => {
    const { symbols, tickers } = useSnapshot(marketStore);

    // Ensure we have enough items to scroll smoothly
    // Create a looped array
    const loopSymbols = React.useMemo(() => {
        if (symbols.length === 0) return [];
        // Multiply list to ensure width > screen width for marquee
        return [...symbols, ...symbols, ...symbols, ...symbols, ...symbols, ...symbols];
    }, [symbols]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-[48px] bg-vx-bg/90 backdrop-blur-md border-t border-vx-border flex items-center overflow-hidden group select-none">
            {/* Left Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-vx-bg to-transparent z-10 pointer-events-none" />
            
            {/* Marquee Content */}
            <div className="flex animate-marquee group-hover:paused items-center pl-4">
                {loopSymbols.map((sym, idx) => (
                    <TickerItem 
                        key={`${sym}-${idx}`} 
                        symbol={sym} 
                        data={tickers[sym] || { symbol: sym, lastPrice: '0.00', priceChangePercent: '0.00' } as any}
                    />
                ))}
            </div>

            {/* Right Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-vx-bg to-transparent z-10 pointer-events-none" />
        </div>
    );
};