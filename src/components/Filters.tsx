import { t } from '@/lib/i18n'
import Link from 'next/link'

export function Filters({
  type,
  category,
  agent,
  setType,
  setCategory,
  setAgent,
}: {
  type: string
  category: string
  agent: string
  setType: (v: string) => void
  setCategory: (v: string) => void
  setAgent: (v: string) => void
}) {
  return (
    <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6 px-4 py-6 lg:px-6">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filter-type" className="block text-sm font-medium mb-1">{t('filterType')}</label>
        <select
          id="filter-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('allTypes')}</option>
          <option value="skill">{t('typeSkill')}</option>
          <option value="mcp">{t('typeMcp')}</option>
          <option value="prompt">{t('typePrompt')}</option>
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="filter-category" className="block text-sm font-medium mb-1">{t('filterCategory')}</label>
        <select
          id="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('allCategories')}</option>
        </select>
      </div>

      <div className="flex-1 min-w-[220px]">
        <label htmlFor="filter-agent" className="block text-sm font-medium mb-1">{t('filterAgent')}</label>
        <select
          id="filter-agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t('allAgents')}</option>
        </select>
      </div>

      <Link
        href="/create"
        className="flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <span aria-hidden="true">+</span> {t('createResource')}
      </Link>
    </section>
  )
}
