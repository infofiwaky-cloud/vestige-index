import { useState, useCallback, useEffect } from 'react'
import en from '@/i18n/en.json'
import es from '@/i18n/es.json'
import zh from '@/i18n/zh.json'
import ar from '@/i18n/ar.json'

export type Language = 'en' | 'es' | 'zh' | 'ar'

const translations: Record<Language, typeof en> = { en, es, zh, ar }

const STORAGE_KEY = 'vestige_lang'

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

export function useLanguage() {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en'
    return (localStorage.getItem(STORAGE_KEY) as Language) || 'en'
  })

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang)
      document.documentElement.lang = newLang
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = useCallback(
    (path: string): string => {
      return getNestedValue(translations[lang] as unknown as Record<string, unknown>, path)
    },
    [lang]
  )

  const isRtl = lang === 'ar'

  return { lang, setLang, t, isRtl }
}

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'es', label: 'Español', native: 'ES' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ar', label: 'Arabic', native: 'عربي' },
]
