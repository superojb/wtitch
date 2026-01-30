import { proxy } from 'valtio';

export interface UIState {
  theme: 'dark' | 'light';
}

export const uiStore = proxy<UIState>({
  theme: 'dark', // Default to dark mode
});

export const toggleTheme = () => {
  uiStore.theme = uiStore.theme === 'dark' ? 'light' : 'dark';
};

export const setTheme = (theme: 'dark' | 'light') => {
    uiStore.theme = theme;
};