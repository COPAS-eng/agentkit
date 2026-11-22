import { t, AGENTS } from '@/lib/i18n'
import type { Resource } from '@/lib/types'

type AgentId = string

function agentName(id: AgentId): string {
  const found = AGENTS.find((a) => a.id === id)
  return found ? found.name : id
}

function compatible(resource: Resource, agentId: AgentId): 'compatible' | 'not-verified' | 'incompatible' {
  if (resource.compatibleAgents.includes(agentId)) return 'compatible'
  if (resource.compatibleAgents.includes('generic') || agentId === 'generic') return 'not-verified'
  return 'incompatible'
}

export function AgentInstallInstructions({
  resource,
  agentId,
}: {
  resource: Resource
  agentId: AgentId
}) {
  const status = compatible(resource, agentId)
  const name = agentName(agentId)

  return (
    <section className="rounded-xl border border-input bg-background p-5">
      <div className="flex items-start gap-3 mb-3">
        <span className="flex-shrink-0 mt-[0.1em]">{status === 'compatible' ? '✓' : status === 'incompatible' ? '✗' : '?'}</span>
        <div>
          <h3 className="text-sm font-semibold">{t('agentInstructions', { agent: name })}</h3>
          <p className="text-xs mt-0.5">
            {status === 'compatible'
              ? t('compatible')
              : status === 'incompatible'
                ? t('incompatible')
                : t('compatibilityNotVerified')}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-input p-3 text-sm">
        {status === 'incompatible' ? (
          <>
            <p className="text-amber-800">{t('incompatible')}: este recurso não declara compatibilidade com {name}.</p>
            <p className="mt-1 text-xs text-stone-400">
              Ainda assim, você pode copiar as instruções abaixo e tentar configurar manualmente.
            </p>
          </>
        ) : (
          <>
            <p className="font-medium mb-1">{resource.instructions}</p>
            {resource.dependencies.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-stone-400">{t('dependencies')}:</p>
                <ul className="list-disc list-inside text-xs text-stone-400 mt-0.5">
                  {resource.dependencies.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
            {resource.permissions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium text-stone-400">{t('permissions')}:</p>
                <ul className="list-disc list-inside text-xs text-stone-400 mt-0.5">
                  {resource.permissions.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {status !== 'incompatible' && resource.demo && (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          {t('demoNotice')}
        </div>
      )}
    </section>
  )
}

export function AgentSelector({
  resource,
  selected,
  onSelect,
}: {
  resource: Resource
  selected: AgentId
  onSelect: (id: AgentId) => void
}) {
  return (
    <section className="rounded-xl border border-input bg-background p-5">
      <h3 className="text-sm font-semibold mb-3">{t('chooseAgent')}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {AGENTS.map((agent) => {
          const status = compatible(resource, agent.id)
          const isSelected = selected === agent.id
          let borderClass = 'border-input'
          let bgClass = 'bg-background'
          if (isSelected) {
            borderClass = 'border-primary'
            bgClass = 'bg-primary/10'
          } else if (status === 'compatible') {
            borderClass = 'border-green-200'
            bgClass = 'bg-green-50'
          } else if (status === 'incompatible') {
            borderClass = 'border-amber-200'
            bgClass = 'bg-amber-50'
          }
          return (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`flex flex-col items-center gap-1.5 rounded-lg p-3 text-sm transition-colors ${borderClass} ${bgClass} ${
                status === 'incompatible' ? 'opacity-60' : ''
              }`}
              aria-pressed={isSelected}
            >
              <span className="font-medium">{agent.name}</span>
              <span className={`text-xs ${
                status === 'compatible'
                  ? 'text-green-700'
                  : status === 'incompatible'
                    ? 'text-amber-700'
                    : 'text-stone-400'
              }`}>
                {status === 'compatible' ? t('compatible') : status === 'incompatible' ? t('incompatible') : t('compatibilityNotVerified')}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
