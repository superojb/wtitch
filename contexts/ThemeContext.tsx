import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { uiStore } from '../store/uiStore';
import { useSnapshot } from 'valtio';

export type VexTheme = 'dark' | 'light';

// Crystal Style Configurations
// Key feature: Grids are almost invisible (opacity 0.05) to emphasize data
const CRYSTAL_DARK = {
    grid: {
        horizontal: { color: 'rgba(255, 255, 255, 0.05)', style: 'dashed', dashedValue: [4, 4] },
        vertical: { color: 'rgba(255, 255, 255, 0.05)', style: 'dashed', dashedValue: [4, 4] }
    },
    candle: {
        bar: { upColor: '#6ee7b7', downColor: '#f43f5e', noChangeColor: '#94a3b8' }, // Mint & Rose
        priceMark: { high: { color: '#94a3b8' }, low: { color: '#94a3b8' }, last: { upColor: '#6ee7b7', downColor: '#f43f5e' } }
    },
    xAxis: { tickText: { color: 'rgba(255,255,255,0.4)', family: 'JetBrains Mono', size: 10 } },
    yAxis: { tickText: { color: 'rgba(255,255,255,0.4)', family: 'JetBrains Mono', size: 10 } },
    crosshair: {
        horizontal: { text: { backgroundColor: '#1e293b', color: '#f1f5f9' }, line: { color: 'rgba(255,255,255,0.2)' } },
        vertical: { text: { backgroundColor: '#1e293b', color: '#f1f5f9' }, line: { color: 'rgba(255,255,255,0.2)' } }
    },
    backgroundColor: 'transparent'
};

const CRYSTAL_LIGHT = {
    grid: {
        horizontal: { color: 'rgba(0, 0, 0, 0.05)', style: 'dashed', dashedValue: [4, 4] },
        vertical: { color: 'rgba(0, 0, 0, 0.05)', style: 'dashed', dashedValue: [4, 4] }
    },
    candle: {
        bar: { upColor: '#059669', downColor: '#e11d48', noChangeColor: '#64748b' },
        priceMark: { high: { color: '#64748b' }, low: { color: '#64748b' }, last: { upColor: '#059669', downColor: '#e11d48' } }
    },
    xAxis: { tickText: { color: 'rgba(0,0,0,0.4)', family: 'JetBrains Mono', size: 10 } },
    yAxis: { tickText: { color: 'rgba(0,0,0,0.4)', family: 'JetBrains Mono', size: 10 } },
    crosshair: {
        horizontal: { text: { backgroundColor: '#e2e8f0', color: '#0f172a' }, line: { color: 'rgba(0,0,0,0.2)' } },
        vertical: { text: { backgroundColor: '#e2e8f0', color: '#0f172a' }, line: { color: 'rgba(0,0,0,0.2)' } }
    },
    backgroundColor: 'transparent'
};

interface ThemeContextType {
    theme: VexTheme;
    getChartStyle: () => any;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', getChartStyle: () => CRYSTAL_DARK });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useSnapshot(uiStore);

    // Sync with DOM
    useEffect(() => {
        const html = document.documentElement;
        // Animation class is handled in CSS (body transition)
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
    }, [theme]);

    const getChartStyle = useCallback(() => {
        return theme === 'dark' ? CRYSTAL_DARK : CRYSTAL_LIGHT;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, getChartStyle }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useVexTheme = () => useContext(ThemeContext);