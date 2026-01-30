import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { uiStore } from '../store/uiStore';
import { useSnapshot } from 'valtio';

export type VexTheme = 'dark' | 'light';

// Mapped from Tailwind OKLCH variables to sRGB for Canvas
const AURORA_DARK = {
    grid: {
        horizontal: { color: 'rgba(255, 255, 255, 0.04)', style: 'solid' },
        vertical: { color: 'rgba(255, 255, 255, 0.04)', style: 'solid' }
    },
    candle: {
        bar: { upColor: '#4ade80', downColor: '#f43f5e', noChangeColor: '#94a3b8' }, 
        priceMark: { high: { color: '#94a3b8' }, low: { color: '#94a3b8' }, last: { upColor: '#4ade80', downColor: '#f43f5e' } }
    },
    xAxis: { tickText: { color: 'rgba(255,255,255,0.4)', family: 'JetBrains Mono', size: 10 } },
    yAxis: { tickText: { color: 'rgba(255,255,255,0.4)', family: 'JetBrains Mono', size: 10 } },
    crosshair: {
        horizontal: { text: { backgroundColor: '#1e293b', color: '#f1f5f9' }, line: { color: 'rgba(255,255,255,0.3)', style: 'dashed' } },
        vertical: { text: { backgroundColor: '#1e293b', color: '#f1f5f9' }, line: { color: 'rgba(255,255,255,0.3)', style: 'dashed' } }
    },
    backgroundColor: 'transparent'
};

const AURORA_LIGHT = {
    grid: {
        horizontal: { color: 'rgba(0, 0, 0, 0.04)', style: 'solid' },
        vertical: { color: 'rgba(0, 0, 0, 0.04)', style: 'solid' }
    },
    candle: {
        bar: { upColor: '#16a34a', downColor: '#e11d48', noChangeColor: '#64748b' },
        priceMark: { high: { color: '#64748b' }, low: { color: '#64748b' }, last: { upColor: '#16a34a', downColor: '#e11d48' } }
    },
    xAxis: { tickText: { color: 'rgba(0,0,0,0.5)', family: 'JetBrains Mono', size: 10 } },
    yAxis: { tickText: { color: 'rgba(0,0,0,0.5)', family: 'JetBrains Mono', size: 10 } },
    crosshair: {
        horizontal: { text: { backgroundColor: '#e2e8f0', color: '#0f172a' }, line: { color: 'rgba(0,0,0,0.3)', style: 'dashed' } },
        vertical: { text: { backgroundColor: '#e2e8f0', color: '#0f172a' }, line: { color: 'rgba(0,0,0,0.3)', style: 'dashed' } }
    },
    backgroundColor: 'transparent'
};

interface ThemeContextType {
    theme: VexTheme;
    getChartStyle: () => any;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', getChartStyle: () => AURORA_DARK });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme } = useSnapshot(uiStore);

    useEffect(() => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
    }, [theme]);

    const getChartStyle = useCallback(() => {
        return theme === 'dark' ? AURORA_DARK : AURORA_LIGHT;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, getChartStyle }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useVexTheme = () => useContext(ThemeContext);