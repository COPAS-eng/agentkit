export type ResourceType = 'skill' | 'mcp' | 'prompt'
export type Lang = 'pt' | 'en'

export interface AgentDestination {
  id: string
  name: string
}

export interface Resource {
  id: string
  type: ResourceType
  title: string
  description: string
  shortDescription: string
  author: string
  version: string
  category: string
  tags: string[]
  compatibleAgents: string[] // agent destination ids
  instructions: string // markdown-ish instructions
  dependencies: string[]
  permissions: string[] // human readable permissions required
  lastUpdated: string // ISO date
  demo: boolean // identificação de conteúdo de demonstração
  createdBy?: string
  createdAt?: string
}

export interface Collection {
  id: string
  name: string
  resourceIds: string[]
  createdAt: string
}

export interface HistoryEntry {
  resourceId: string
  viewedAt: string
}

export interface FilterState {
  query: string
  type: string // '' = all
  category: string
  agent: string
  sort: 'name' | 'popularity' | 'updated'
}

export interface I18nStrings {
  [key: string]: string
}
