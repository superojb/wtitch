import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun, Grid, LayoutGrid, Square } from 'lucide-react';
import { toggleTheme, uiStore, setChartLayout } from '../store/uiStore';
import { useSnapshot } from 'valtio';
import { cn } from '../lib/utils';

export const Header: React.FC = () => {
  const { theme, chartLayout } = useSnapshot(uiStore);

  return (
    <div className="fixed top-2 right-4 z-[101] flex items-center gap-2">
      {/* Layout Controls */}
      <div className="flex items-center p-1 rounded-full bg-vx-surface/80 backdrop-blur border border-vx-border shadow-lg">
         <Button variant="ghost" size="icon" onClick={() => setChartLayout('single')} className={cn("rounded-full h-7 w-7", chartLayout === 'single' && "bg-vx-bg text-vx-accent")}>
             <Square className="h-3.5 w-3.5" />
         </Button>
         <Button variant="ghost" size="icon" onClick={() => setChartLayout('2x2')} className={cn("rounded-full h-7 w-7", chartLayout === '2x2' && "bg-vx-bg text-vx-accent")}>
             <Grid className="h-3.5 w-3.5" />
         </Button>
         <Button variant="ghost" size="icon" onClick={() => setChartLayout('2x4')} className={cn("rounded-full h-7 w-7", chartLayout === '2x4' && "bg-vx-bg text-vx-accent")}>
             <LayoutGrid className="h-3.5 w-3.5" />
         </Button>
      </div>

      {/* Theme Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme} 
        className="rounded-full h-9 w-9 bg-vx-surface/80 backdrop-blur border border-vx-border shadow-lg hover:bg-vx-surface text-vx-text-primary"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
};