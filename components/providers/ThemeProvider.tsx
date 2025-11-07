'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  powerSaver: boolean;
  setPowerSaver: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider - Manages theme state and CSS custom properties
 * 
 * Provides:
 * - Power Saver mode (disables heavy animations and effects)
 * - High Contrast mode (increases contrast, reduces blur)
 * - Reduced Motion detection (respects user preferences)
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [powerSaver, setPowerSaver] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply data attributes to document element
  useEffect(() => {
    const root = document.documentElement;
    
    if (powerSaver) {
      root.setAttribute('data-power-saver', 'true');
    } else {
      root.removeAttribute('data-power-saver');
    }

    if (highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }
  }, [powerSaver, highContrast]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPowerSaver = localStorage.getItem('powerSaver');
    const savedHighContrast = localStorage.getItem('highContrast');

    if (savedPowerSaver) {
      setPowerSaver(savedPowerSaver === 'true');
    }

    if (savedHighContrast) {
      setHighContrast(savedHighContrast === 'true');
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('powerSaver', String(powerSaver));
  }, [powerSaver]);

  useEffect(() => {
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  const value = {
    powerSaver,
    setPowerSaver,
    highContrast,
    setHighContrast,
    reducedMotion,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
