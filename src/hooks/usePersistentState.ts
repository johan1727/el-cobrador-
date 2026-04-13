import { useState, useEffect, useCallback } from 'react';

export function usePersistentState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setPersistentValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error saving to localStorage key "${key}":`, error);
      }
      return valueToStore;
    });
  }, [key]);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setPersistentValue];
}

// Hook específico para configuración de la app
export function useAppConfig() {
  const [selectedToneId, setSelectedToneId] = usePersistentState<string | null>('el-cobrador-tone', null);
  const [humorLevel, setHumorLevel] = usePersistentState<'light' | 'balanced' | 'spicy'>('el-cobrador-level', 'balanced');
  const [currency, setCurrency] = usePersistentState<'MXN' | 'USD'>('el-cobrador-currency', 'MXN');
  const [lastDebtor, setLastDebtor] = usePersistentState<string>('el-cobrador-last-debtor', '');
  const [isDarkMode, setIsDarkMode] = usePersistentState<boolean>('el-cobrador-dark-mode', false);

  return {
    selectedToneId,
    setSelectedToneId,
    humorLevel,
    setHumorLevel,
    currency,
    setCurrency,
    lastDebtor,
    setLastDebtor,
    isDarkMode,
    setIsDarkMode
  };
}
