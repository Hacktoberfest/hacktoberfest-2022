import { createContext, useCallback, useContext, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, liteTheme } from 'themes/themes';

const ThemeContext = createContext(() =>
  console.error('Attempted to set theme outside of ThemeContext')
);

export const useThemeToggle = () => useContext(ThemeContext);

export const Theme = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const themeToggler = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : liteTheme}>
      <ThemeContext.Provider value={themeToggler}>
        {children}
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};
