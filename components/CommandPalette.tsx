import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSnapshot } from 'valtio';
import { uiStore, setCommandPalette } from '../store/uiStore';
import { marketStore, selectSymbol } from '../store/marketStore';
import { Search, Hash, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen } = useSnapshot(uiStore);
  const { symbols } = useSnapshot(marketStore);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter symbols based on query
  const filteredSymbols = useMemo(() => {
    if (!query) return symbols.slice(0, 10);
    return symbols
      .filter(s => s.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);
  }, [query, symbols]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!uiStore.isCommandPaletteOpen);
      }
      
      if (!uiStore.isCommandPaletteOpen) return;

      if (e.key === 'Escape') {
        setCommandPalette(false);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredSymbols.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredSymbols.length) % filteredSymbols.length);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredSymbols[selectedIndex]) {
            handleSelect(filteredSymbols[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSymbols, selectedIndex]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
        // Short delay to ensure mount
        setTimeout(() => inputRef.current?.focus(), 10);
        setQuery('');
        setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  const handleSelect = (symbol: string) => {
      selectSymbol(symbol);
      setCommandPalette(false);
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/50 backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPalette(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-2xl animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center border-b border-slate-800 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
          <input
            ref={inputRef}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 text-slate-100"
            placeholder="Search symbols..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
            }}
          />
          <div className="text-[10px] text-slate-600 border border-slate-800 rounded px-1.5 py-0.5">ESC</div>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-1">
          {filteredSymbols.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">No symbol found.</div>
          ) : (
            filteredSymbols.map((symbol, index) => (
              <div
                key={symbol}
                className={cn(
                  "flex items-center justify-between px-2 py-2 rounded-md cursor-pointer text-xs group",
                  index === selectedIndex ? "bg-primary/10 text-primary" : "text-slate-300 hover:bg-slate-900"
                )}
                onClick={() => handleSelect(symbol)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-2">
                    <Hash className={cn("h-3 w-3", index === selectedIndex ? "text-primary" : "text-slate-600")} />
                    <span className="font-bold">{symbol}</span>
                </div>
                {index === selectedIndex && (
                    <ArrowUpRight className="h-3 w-3 text-primary/50" />
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="border-t border-slate-800 bg-slate-950 px-3 py-1.5 flex justify-between">
            <span className="text-[10px] text-slate-500">
                <span className="font-bold text-slate-300">{filteredSymbols.length}</span> results
            </span>
            <span className="text-[10px] text-slate-600">
                Use <span className="text-slate-400">↑↓</span> to navigate
            </span>
        </div>
      </div>
    </div>
  );
};