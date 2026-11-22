'use client'

import { useState } from 'react'
import { t } from '@/lib/i18n'
import type { Resource } from '@/lib/types'
import { addHistory, isFavorite, toggleFavorite } from '@/lib/store'
import { AgentSelector, AgentInstallInstructions } from './AgentInstall'

export function ResourceDetail({ resource }: { resource: Resource }) {
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>('claude-code')

  const fav = isFavorite(resource.id)

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.instructions)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDownload = () => {
    const blob = new Blob([resource.instructions], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resource.id}.md`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 1500)
  }

  return (
    <section className="px-4 py-6 lg:px-6 max-w-4xl mx-auto">
      <nav className="mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <span aria-hidden="true">←</span> {t('backToCatalog')}
        </a>
      </nav>

      <article className="rounded-xl border border-input bg-background p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center rounded-md border border-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                {resource.type === 'skill' ? t('typeSkill') : resource.type === 'mcp' ? t('typeMcp') : t('typePrompt')}
              </span>
              {resource.demo && (
                <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                  {t('demoContent')}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-1">{resource.title}</h1>
            <p className="text-sm text-stone-500 mb-4">
              {t('by')} {resource.author} · {t('version')} {resource.version} · {t('category')}: {resource.category}
            </p>

            <p className="text-stone-700 leading-relaxed mb-5">{resource.description}</p>

            <div className="space-y-3">
              <div className="rounded-lg border border-input p-4">
                <h3 className="text-sm font-semibold mb-2">{t('tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-input bg-stone-50 px-2.5 py-0.5 text-xs text-stone-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-input p-4">
                <h3 className="text-sm font-semibold mb-2">{t('compatibleWith')}</h3>
                <p className="text-sm text-stone-600">
                  {resource.compatibleAgents.map((a) => a).join(', ') || '—'}
                </p>
              </div>

              {resource.dependencies.length > 0 && (
                <div className="rounded-lg border border-input p-4">
                  <h3 className="text-sm font-semibold mb-2">{t('dependencies')}</h3>
                  <ul className="list-disc list-inside text-sm text-stone-600">
                    {resource.dependencies.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {resource.permissions.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h3 className="text-sm font-semibold text-amber-800 mb-2">{t('permissions')}</h3>
                  <ul className="list-disc list-inside text-sm text-amber-700">
                    {resource.permissions.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="rounded-lg border border-input p-4">
              <h3 className="text-sm font-semibold mb-2">{t('lastUpdated')}</h3>
              <p className="text-sm text-stone-600 mb-4">
                {new Date(resource.lastUpdated).toLocaleDateString()}
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                >
                  {copied ? (
                    <span className="text-green-700">{t('copySuccess')}</span>
                  ) : (
                    <>
                      <span aria-hidden="true">📋</span> {t('copy')}
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-input px-3 py-2.5 text-sm transition-colors hover:bg-accent"
                >
                  {downloaded ? (
                    <span className="text-blue-700">{t('downloadSuccess')}</span>
                  ) : (
                    <>
                      <span aria-hidden="true">⬇</span> {t('download')}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleFavorite(resource.id)}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    fav
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'border border-input hover:bg-accent'
                  }`}
                >
                  {fav ? t('removeFromFavorites') : t('addToFavorites')}
                </button>
              </div>
            </div>

            {resource.demo && (
              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-xs font-semibold text-amber-800 mb-1">{t('demoContent')}</h3>
                <p className="text-xs text-amber-700">{t('demoNotice')}</p>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{t('instructions')}</h2>
          <div className="rounded-lg border border-input p-5 text-sm font-mono text-stone-700">
            {resource.instructions}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">{t('addToAgent')}</h2>
          <p className="text-sm text-stone-600 mb-3">
            Selecione o agente para ver instruções de instalação adequadas ao destino.
          </p>
          <AgentSelector resource={resource} selected={selectedAgent} onSelect={setSelectedAgent} />
          <AgentInstallInstructions resource={resource} agentId={selectedAgent} />
        </div>

        <div className="mt-8 rounded-lg border border-input p-5">
          <h3 className="text-sm font-semibold mb-2">{t('warningTitle')}</h3>
          <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
            <li>{t('warningUntrusted')}</li>
            {resource.permissions.length > 0 && <li>{t('warningSensitive')}</li>}
            <li>{t('noSecrets')}</li>
          </ul>
        </div>
      </article>
    </section>
  )
}
