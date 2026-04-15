import { useState, useEffect, useCallback } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'vestige_theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    const initial = stored === 'light' ? 'light' : 'dark'
    setThemeState(initial)
    applyTheme(initial)
  }, [])

  function applyTheme(t: Theme) {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', t)
  }

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, t)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return { theme, setTheme, toggleTheme }
}
