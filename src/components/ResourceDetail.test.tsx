import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResourceDetail } from '@/components/ResourceDetail'

describe('resource detail', () => {
  const resource = {
    id: 'demo-1',
    type: 'skill' as const,
    title: 'Resumo de reuniões',
    description: 'Gera resumo de reunião',
    shortDescription: 'resumo',
    author: 'Equipe AgentKit',
    version: '1.0.0',
    category: 'Produtividade',
    tags: ['reunião'],
    compatibleAgents: ['claude-code', 'generic'],
    instructions: '# Instruções\n\nUse bem.',
    dependencies: [],
    permissions: [],
    lastUpdated: new Date().toISOString(),
    demo: true,
    createdAt: new Date().toISOString(),
  }

  it('shows details and demo notice', () => {
    render(<ResourceDetail resource={resource} />)
    expect(screen.getByText('Resumo de reuniões')).toBeInTheDocument()
    expect(screen.getAllByText('Conteúdo de demonstração').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Use bem\./).length).toBeGreaterThan(0)
  })

  it('copies instructions to clipboard', async () => {
    const writeText = vi.fn()
    vi.stubGlobal('navigator', { clipboard: { writeText } } as any)
    render(<ResourceDetail resource={resource} />)
    fireEvent.click(screen.getByText('Copiar'))
    expect(writeText).toHaveBeenCalledWith(resource.instructions)
    expect(screen.getByText('Copiado para a área de transferência.')).toBeInTheDocument()
  })
})
