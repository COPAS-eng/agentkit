'use client'

import { useState, useCallback, useEffect } from 'react'
import { getResources, addHistory } from '@/lib/store'
import { t } from '@/lib/i18n'
import type { Resource } from '@/lib/types'
import { Navbar } from '@/components/Navbar'
import { Filters } from '@/components/Filters'
import { ResourceList } from '@/components/ResourceList'
import type { FilterState } from '@/lib/types'

const EMPTY_FILTER: FilterState = { query: '', type: '', category: '', agent: '', sort: 'name' }

export default function CatalogPage() {
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER)
  const [resources, setResources] = useState<Resource[]>([])

  const filtered = useCallback(() => {
    let result = getResources()
    if (filter.query) {
      const q = filter.query.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          r.author.toLowerCase().includes(q)
      )
    }
    if (filter.type) result = result.filter((r) => r.type === filter.type)
    if (filter.category) result = result.filter((r) => r.category.toLowerCase() === filter.category.toLowerCase())
    if (filter.agent) {
      result = result.filter((r) => r.compatibleAgents.includes(filter.agent))
    }
    return result.sort((a, b) => {
      if (filter.sort === 'name') return a.title.localeCompare(b.title)
      if (filter.sort === 'updated') return b.lastUpdated.localeCompare(a.lastUpdated)
      return 0 // popularity placeholder
    })
  }, [filter])

  const list = filtered()

  useEffect(() => {
    list.forEach((r) => addHistory({ resourceId: r.id, viewedAt: new Date().toISOString() }))
  }, [list])

  return (
    <section className="px-4 py-6 lg:px-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">{t('appName')}</h1>
        <p className="mt-1 text-sm text-stone-600">{t('tagline')}</p>
      </header>

      <Filters
        type={filter.type}
        category={filter.category}
        agent={filter.agent}
        setType={(v) => setFilter({ ...filter, type: v })}
        setCategory={(v) => setFilter({ ...filter, category: v })}
        setAgent={(v) => setFilter({ ...filter, agent: v })}
      />

      <ResourceList
        resources={list}
        query={filter.query}
        type={filter.type}
        category={filter.category}
        agent={filter.agent}
      />
    </section>
  )
}
