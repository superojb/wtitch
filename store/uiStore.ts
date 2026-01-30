import { proxy } from 'valtio';

export type ChartLayoutMode = 'single' | '2x2' | '2x4';

export interface UIState {
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  chartLayout: ChartLayoutMode;
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    symbol: string | null;
  }
}

export const uiStore = proxy<UIState>({
  theme: 'dark',
  isCommandPaletteOpen: false,
  chartLayout: 'single', // Default 1x1
  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    symbol: null
  }
});

export const toggleTheme = () => {
  uiStore.theme = uiStore.theme === 'dark' ? 'light' : 'dark';
};

export const setChartLayout = (mode: ChartLayoutMode) => {
    uiStore.chartLayout = mode;
};

export const setCommandPalette = (isOpen: boolean) => {
  uiStore.isCommandPaletteOpen = isOpen;
};

export const openContextMenu = (x: number, y: number, symbol: string) => {
    uiStore.contextMenu = { isOpen: true, x, y, symbol };
}

export const closeContextMenu = () => {
    uiStore.contextMenu.isOpen = false;
}