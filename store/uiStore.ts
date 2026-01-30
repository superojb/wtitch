import { proxy } from 'valtio';

export interface UIState {
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
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

export const setTheme = (theme: 'dark' | 'light') => {
    uiStore.theme = theme;
};

export const toggleCommandPalette = () => {
  uiStore.isCommandPaletteOpen = !uiStore.isCommandPaletteOpen;
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