import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CatalogPage from '@/app/page'
import { getResources } from '@/lib/store'

describe('catalog page', () => {
  it('renders all resources', () => {
    render(<CatalogPage />)
    expect(screen.getByText('AgentKit')).toBeInTheDocument()
    const resources = getResources()
    resources.forEach((r) => {
      expect(
        screen.getByText(r.title, { selector: 'a' })
      ).toBeInTheDocument()
    })
  })

  it('filters by type', () => {
    render(<CatalogPage />)
    const resources = getResources()
    const skills = resources.filter((r) => r.type === 'skill')
    expect(skills.length).toBeGreaterThan(0)

    const typeSelect = screen.getByLabelText('Tipo')
    fireEvent.change(typeSelect, { target: { value: 'skill' } })
    skills.forEach((r) =>
      expect(screen.getByText(r.title, { selector: 'a' })).toBeInTheDocument()
    )
  })
})
