'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { t, Lang, getLang } from '@/lib/i18n'
import type { Resource } from '@/lib/types'
import { addResource, updateResource, saveDraft, clearDraft, getDraft } from '@/lib/store'

type FormData = Partial<Resource>

interface ValidationError {
  field: keyof FormData
  message: string
}

export function ResourceForm({ resource }: { resource?: Resource }) {
  const router = useRouter()
  const isEdit = !!resource
  const [form, setForm] = useState<FormData>({
    id: resource?.id,
    type: resource?.type,
    title: resource?.title || '',
    description: resource?.description || '',
    shortDescription: resource?.shortDescription || '',
    author: resource?.author || '',
    version: resource?.version || '1.0.0',
    category: resource?.category || '',
    tags: resource?.tags || [],
    compatibleAgents: resource?.compatibleAgents || [],
    instructions: resource?.instructions || '',
    dependencies: resource?.dependencies || [],
    permissions: resource?.permissions || [],
    demo: resource?.demo || false,
  })
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [demo, setDemo] = useState(!!resource?.demo)

  const lang = getLang() as Lang

  const validate = (): boolean => {
    const nextErrors: ValidationError[] = []
    if (!form.title?.trim()) {
      nextErrors.push({ field: 'title', message: t('errorInvalid') })
    }
    if (!form.description?.trim()) {
      nextErrors.push({ field: 'description', message: t('errorInvalid') })
    }
    if (!form.type) {
      nextErrors.push({ field: 'type', message: t('errorInvalid') })
    }
    if (!form.instructions?.trim()) {
      nextErrors.push({ field: 'instructions', message: t('errorInvalid') })
    }
    setErrors(nextErrors)
    return nextErrors.length === 0
  }

  const handleChange = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors(errors.filter((e) => e.field !== field))
  }

  const handleTags = (value: string) => {
    const tags = value.split(',').map((t) => t.trim()).filter(Boolean)
    setForm((prev) => ({ ...prev, tags }))
    setErrors(errors.filter((e) => e.field !== 'tags'))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const now = new Date().toISOString()
    const title = form.title!.trim()
    const description = form.description!.trim()
    const shortDescription = form.shortDescription!.trim()
    const author = form.author!.trim() || 'Anônimo'
    const version = form.version!.trim() || '1.0.0'
    const category = form.category!.trim() || 'Outro'
    const instructions = form.instructions!.trim()
    const entry: Resource = {
      id: form.id || `resource-${Date.now()}`,
      type: form.type as 'skill' | 'mcp' | 'prompt',
      title,
      description,
      shortDescription,
      author,
      version,
      category,
      tags: form.tags || [],
      compatibleAgents: form.compatibleAgents || [],
      instructions,
      dependencies: form.dependencies || [],
      permissions: form.permissions || [],
      lastUpdated: now,
      demo: demo,
      createdAt: resource?.createdAt || now,
    }

    if (isEdit) {
      updateResource(entry.id, entry)
    } else {
      addResource(entry)
    }
    clearDraft()
    router.push(`/resource/${entry.id}`)
  }

  const handleSaveDraft = () => {
    saveDraft(form)
  }

  return (
    <section className="px-4 py-6 lg:px-6 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl font-bold">{isEdit ? t('editResource') : t('createResource')}</h2>

        {errors.length > 0 && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {t('errorInvalid')}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('titleLabel')}</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t('titlePlaceholder')}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('typeLabel')}</label>
            <select
              value={form.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="skill">{t('typeSkill')}</option>
              <option value="mcp">{t('typeMcp')}</option>
              <option value="prompt">{t('typePrompt')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('version')}</label>
            <input
              type="text"
              value={form.version || ''}
              onChange={(e) => handleChange('version', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('category')}</label>
            <input
              type="text"
              value={form.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('descriptionLabel')}</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Resumo</label>
            <input
              type="text"
              value={form.shortDescription || ''}
              onChange={(e) => handleChange('shortDescription', e.target.value)}
              placeholder="Resumo curto do recurso"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">{t('instructionsLabel')}</label>
          <textarea
            value={form.instructions || ''}
            onChange={(e) => handleChange('instructions', e.target.value)}
            placeholder={t('instructionsPlaceholder')}
            rows={8}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('tags')}</label>
            <p>Separe as tags por vírgula.</p>
            <input
              type="text"
              value={form.tags?.join(', ') || ''}
              onChange={(e) => handleTags(e.target.value)}
              placeholder="ex: reunião, resumo, produtividade"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('dependencies')}</label>
            <input
              type="text"
              value={form.dependencies?.join(', ') || ''}
              onChange={(e) => handleChange('dependencies', e.target.value.split(',').map((d) => d.trim()).filter(Boolean))}
              placeholder="ex: mcp-tickets-server, node >= 18"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('permissions')}</label>
            <input
              type="text"
              value={form.permissions?.join(', ') || ''}
              onChange={(e) => handleChange('permissions', e.target.value.split(',').map((p) => p.trim()).filter(Boolean))}
              placeholder="ex: acesso à rede, leitura de arquivos"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">{t('compatibleWith')}</label>
            <p className="text-xs text-stone-400 mb-1">Selecione os agentes compatíveis.</p>
            <div className="flex flex-wrap gap-2">
              {['claude-code', 'opencode', 'hermes', 'cursor', 'antigravity', 'generic'].map((id) => {
                const selected = form.compatibleAgents?.includes(id)
                return (
                  <label key={id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) =>
                        handleChange(
                          'compatibleAgents',
                          e.target.checked
                            ? [...(form.compatibleAgents || []), id]
                            : (form.compatibleAgents || []).filter((a) => a !== id)
                        )
                      }
                      className="rounded border-stone-600 text-primary focus:ring-ring"
                    />
                    {id === 'claude-code' ? 'Claude Code' : id === 'opencode' ? 'OpenCode' : id === 'hermes' ? 'Hermes' : id === 'cursor' ? 'Cursor' : id === 'antigravity' ? 'Antigravity' : 'Genérico'}
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={demo}
              onChange={(e) => setDemo(e.target.checked)}
              className="rounded border-stone-600 text-amber-600 focus:ring-ring"
            />
            {t('demoContent')}
          </label>
          <p className="text-xs text-stone-400 ml-2">
            Marque se este é um conteúdo de demonstração (exemplo, não um recurso verificado).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isEdit ? t('save') : t('publish')}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 rounded-lg border border-input px-4 py-2.5 text-sm font-medium hover:bg-accent"
          >
            {t('saveDraft')}
          </button>
        </div>
      </form>
    </section>
  )
}
