import Link from 'next/link'
import { t } from '@/lib/i18n'
import type { Resource } from '@/lib/types'
import { isFavorite, toggleFavorite } from '@/lib/store'

export function ResourceCard({ resource }: { resource: Resource }) {
  const fav = isFavorite(resource.id)

  return (
    <article
      className="rounded-xl border border-input bg-background p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-stone-700 px-2 py-0.5 text-xs font-medium text-stone-400">
            {resource.type === 'skill' ? t('typeSkill') : resource.type === 'mcp' ? t('typeMcp') : t('typePrompt')}
          </span>
          {resource.demo && (
            <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
              {t('demoContent')}
            </span>
          )}
        </div>

        <Link href={`/resource/${resource.id}`} className="line-clamp-1 text-lg font-semibold hover:underline">
          {resource.title}
        </Link>

        <p className="line-clamp-2 text-sm text-stone-400">{resource.shortDescription}</p>

        <div className="mt-3 flex items-center gap-3 text-xs text-stone-400">
          <span>{t('author')}: <span className="font-medium">{resource.author}</span></span>
          <span aria-hidden="true">·</span>
          <span>{t('version')}: {resource.version}</span>
          <span aria-hidden="true">·</span>
          <span>{t('updated')}: {new Date(resource.lastUpdated).toLocaleDateString()}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(resource.id)
            }}
            className={`rounded-lg p-2 transition-colors ${
              fav
                ? 'bg-amber-100 text-amber-700'
                : 'border border-input hover:bg-accent hover:text-accent-foreground'
            }`}
            aria-label={fav ? t('removeFromFavorites') : t('addToFavorites')}
            aria-pressed={fav}
            title={fav ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <span className="sr-only">{fav ? t('removeFromFavorites') : t('addToFavorites')}</span>
            ★
          </button>
        </div>
      </div>
    </article>
  )
}
