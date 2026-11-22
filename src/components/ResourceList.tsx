import { t } from '@/lib/i18n'
import type { Resource } from '@/lib/types'
import { ResourceCard } from './ResourceCard'

export function ResourceList({
  resources,
  query,
  type,
  category,
  agent,
}: {
  resources: Resource[]
  query: string
  type: string
  category: string
  agent: string
}) {
  const count = resources.length
  const label = count === 1 ? t('resourcesFound') : t('resourcesFoundPlural')

  if (count === 0) {
    return (
      <section className="px-4 py-12 lg:px-6 text-center">
        <h2 className="text-lg font-medium">{t('noResults')}</h2>
        <p className="mt-1 text-sm text-stone-400">{t('noResultsHint')}</p>
      </section>
    )
  }

  return (
    <section className="px-4 py-6 lg:px-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">{label.replace('{{count}}', String(count))}</span>
        <span className="text-sm text-stone-400">· {t('filterType')}: {type || t('allTypes')}</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <li key={resource.id}>
            <ResourceCard resource={resource} />
          </li>
        ))}
      </ul>
    </section>
  )
}
