import { createContext, useState, useEffect } from 'react';

export const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedScale = parseFloat(localStorage.getItem('fontScale')) || 1;
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    setFontScale(savedScale);
    setHighContrast(savedContrast);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);

    if (highContrast) {
        document.documentElement.style.setProperty('--bg-color', 'var(--hc-color-bg)');
        document.documentElement.style.setProperty('--text-color', 'var(--hc-color-text)');
        document.body.classList.add('high-contrast');
    } else {
        document.documentElement.style.setProperty('--bg-color', 'var(--color-bg)');
        document.documentElement.style.setProperty('--text-color', 'var(--color-text)');
        document.body.classList.remove('high-contrast');
    }

    localStorage.setItem('fontScale', fontScale);
    localStorage.setItem('highContrast', highContrast);
    }, [fontScale, highContrast]);
  return (
    <AccessibilityContext.Provider value={{ fontScale, setFontScale, highContrast, setHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}
