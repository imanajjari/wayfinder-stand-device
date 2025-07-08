import { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

const lightTheme = {
  background: "#f8f8f8",
  canvasBackground: "#ffffff",
  text: "#1a1a1a",
  modelColor: "#474D84",
  pointStart: "blue",
  pointEnd: "red",
};

const darkTheme = {
  background: "#1a1a1a",
  canvasBackground: "#26282B",
  text: "#ffffff",
  modelColor: "#474D84",
  pointStart: "#3b82f6",
  pointEnd: "#ef4444",
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null); // حالت اولیه بدون تم

  useEffect(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('app-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    if (themeColors?.text) {
      document.documentElement.style.setProperty('--text-color', themeColors.text);
    }
  }, [themeColors]);

  if (!theme) return null; // یا loading spinner

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
