import type { Resource, Collection, HistoryEntry, FilterState } from './types'

const RESOURCES_KEY = 'agentkit:resources'
const COLLECTIONS_KEY = 'agentkit:collections'
const HISTORY_KEY = 'agentkit:history'
const DRAFT_KEY = 'agentkit:draft'

const DEMO_RESOURCES: Resource[] = [
  {
    id: 'demo-1',
    type: 'skill',
    title: 'Resumo de reuniões',
    shortDescription:
      'Gera um resumo estruturado de notas de reunião, incluindo decisões e próximos passos.',
    description:
      'Skill que recebe notas brutas de reunião e produz um resumo estruturado com decisões tomadas, responsáveis e próximos passos, no formato de sua preferência.',
    author: 'Equipe AgentKit',
    version: '1.0.0',
    category: 'Produtividade',
    tags: ['reunião', 'resumo', 'produtividade'],
    compatibleAgents: ['claude-code', 'cursor', 'generic'],
    instructions:
      '# Resumo de reuniões\n\nCole as notas da reunião abaixo e informe o formato desejado (ex.: tópicos, e-mail, ata).\n\n```\n{{notas_reuniao}}\n```\n\nO agente deve retornar:\n1. Decisões tomadas\n2. Próximos passos\n3. Responsáveis por cada ação',
    dependencies: [],
    permissions: [],
    lastUpdated: new Date().toISOString(),
    demo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    type: 'mcp',
    title: 'Conector de tickets',
    shortDescription: 'Conecta o agente ao sistema de tickets para criar e listar chamados.',
    description:
      'Servidor MCP que expõe ferramentas para criar, listar e atualizar tickets de suporte através de uma API REST.',
    author: 'Equipe AgentKit',
    version: '0.4.0',
    category: 'Integração',
    tags: ['tickets', 'suporte', 'mcp', 'api'],
    compatibleAgents: ['claude-code', 'cursor', 'generic'],
    instructions:
      '# Conector de tickets (MCP)\n\nConfiguração de conexão com o servidor de tickets.\n\nComando: `mcp-tickets-server`\nArgumentos: `--api-url {{API_URL}} --token {{TICKET_TOKEN}}`\n\nVariáveis de ambiente:\n- `API_URL`: URL da API de tickets (defina localmente)\n- `TICKET_TOKEN`: token de autenticação (defina localmente)\n\nPermissões: leitura e gravação de tickets.',
    dependencies: ['mcp-tickets-server'],
    permissions: ['acesso à rede', 'leitura e gravação de tickets'],
    lastUpdated: new Date().toISOString(),
    demo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    type: 'prompt',
    title: 'Revisão de código',
    shortDescription: 'Prompt para revisar pull requests focando em segurança e clareza.',
    description:
      'Prompt reutilizável que orienta o agente a revisar diffs de pull requests, destacando problemas de segurança, bugs e oportunidades de clareza.',
    author: 'Equipe AgentKit',
    version: '2.1.0',
    category: 'Segurança',
    tags: ['revisão', 'código', 'segurança', 'pull request'],
    compatibleAgents: ['claude-code', 'opencode', 'cursor', 'generic'],
    instructions:
      '# Revisão de código\n\nRevise o diff a seguir focando em:\n1. Problemas de segurança\n2. Bugs lógicos\n3. Clareza e legibilidade\n\nDiff:\n```\n{{diff}}\n```\n\nApresente os achados agrupados por gravidade e sugira correções concretas.',
    dependencies: [],
    permissions: [],
    lastUpdated: new Date().toISOString(),
    demo: true,
    createdAt: new Date().toISOString(),
  },
]

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage indisponível em ambientes privados; ignora silenciosamente
  }
}

export function getResources(): Resource[] {
  const stored = load<Resource[]>(RESOURCES_KEY, [])
  if (stored && stored.length > 0) return stored
  save(RESOURCES_KEY, DEMO_RESOURCES)
  return DEMO_RESOURCES
}

export function setResources(resources: Resource[]) {
  save(RESOURCES_KEY, resources)
}

export function getResource(id: string): Resource | undefined {
  return getResources().find((r) => r.id === id)
}

export function addResource(resource: Resource) {
  const resources = getResources()
  save(RESOURCES_KEY, [...resources, resource])
}

export function updateResource(id: string, patch: Partial<Resource>) {
  const resources = getResources().map((r) =>
    r.id === id ? { ...r, ...patch } : r
  )
  save(RESOURCES_KEY, resources)
}

export function deleteResource(id: string) {
  save(RESOURCES_KEY, getResources().filter((r) => r.id !== id))
}

export function getCollections(): Collection[] {
  return load<Collection[]>(COLLECTIONS_KEY, [])
}

export function setCollections(collections: Collection[]) {
  save(COLLECTIONS_KEY, collections)
}

export function addCollection(collection: Collection) {
  const collections = getCollections()
  save(COLLECTIONS_KEY, [...collections, collection])
}

export function getHistory(): HistoryEntry[] {
  return load<HistoryEntry[]>(HISTORY_KEY, [])
}

export function addHistory(entry: HistoryEntry) {
  const history = getHistory()
  const filtered = history.filter((h) => h.resourceId !== entry.resourceId)
  save(HISTORY_KEY, [entry, ...filtered].slice(0, 50))
}

export function isFavorite(id: string): boolean {
  return load<string[]>(`${RESOURCES_KEY}:favorites`, []).includes(id)
}

export function toggleFavorite(id: string) {
  const key = `${RESOURCES_KEY}:favorites`
  const favs = load<string[]>(key, [])
  if (favs.includes(id)) {
    save(key, favs.filter((f) => f !== id))
  } else {
    save(key, [...favs, id])
  }
}

export function getFavorites(): Resource[] {
  const favs = load<string[]>(`${RESOURCES_KEY}:favorites`, [])
  return getResources().filter((r) => favs.includes(r.id))
}

export function getDraft() {
  return load<Partial<Resource> | null>(DRAFT_KEY, null)
}

export function saveDraft(draft: Partial<Resource>) {
  save(DRAFT_KEY, draft)
}

export function clearDraft() {
  save(DRAFT_KEY, null)
}

export const EMPTY_FILTER: FilterState = {
  query: '',
  type: '',
  category: '',
  agent: '',
  sort: 'name',
}
