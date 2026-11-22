'use client'

import Link from 'next/link'
import { t, getLang, setLang, Lang, AGENTS } from '@/lib/i18n'

export function Navbar() {
  const lang = getLang()

  return (
    <nav className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/80">
      <div className="flex flex-col lg:flex-row items-center gap-4 px-4 py-3 lg:px-6 lg:py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <span className="rounded-md border border-stone-700 px-1.5 py-0.5 text-sm font-mono text-stone-300">agentkit</span>
          <span className="font-semibold">Kit</span>
        </Link>

        <div className="flex-1 max-w-xl">
          <form
            role="search"
            className="relative"
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('q') as HTMLInputElement | null
              const params = new URLSearchParams()
              if (input?.value) params.set('q', input.value)
              window.history.pushState(null, '', `?${params.toString()}`)
            }}
          >
            <label className="sr-only">{t('searchLabel')}</label>
            <input
              name="q"
              type="search"
              placeholder={t('searchPlaceholder')}
              defaultValue=""
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-70"
            />
            <button
              type="submit"
              className="absolute right-2 top-2.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t('validate')}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3 ml-auto lg:ml-0">
          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            className="rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label={t('language')}
          >
            {lang === 'pt' ? t('languageEn') : t('languagePt')}
          </button>
        </div>
      </div>
    </nav>
  )
}
