import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ThemeProvider } from 'styled-components';

import { mainTheme } from 'themes/themes';

const ThemeContext = createContext(() =>
  console.error('Attempted to set theme outside of ThemeContext'),
);

export const useThemeToggle = () => useContext(ThemeContext);

export const Theme = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const themeToggler = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    if (['dark', 'light'].includes(localTheme)) setTheme(localTheme);
  }, []);

  return (
    <ThemeProvider theme={{ ...mainTheme }}>
      <ThemeContext.Provider value={themeToggler}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};
