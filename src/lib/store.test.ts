import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getResources, addResource, updateResource, deleteResource, toggleFavorite, isFavorite, getFavorites } from '@/lib/store'

beforeEach(() => {
  // reset localStorage
  ;(window.localStorage as unknown as { clear: () => void }).clear()
  vi.stubGlobal('localStorage', window.localStorage)
})

describe('store', () => {
  it('returns demo resources when empty', () => {
    const resources = getResources()
    expect(resources.length).toBeGreaterThan(0)
    expect(resources.every((r) => r.demo)).toBe(true)
    expect(resources.some((r) => r.id.startsWith('seed-'))).toBe(true)
  })

  it('adds and deletes a resource', () => {
    const before = getResources().length
    const resource = {
      id: 'test-1',
      type: 'prompt' as const,
      title: 'Test Prompt',
      description: 'A test prompt',
      shortDescription: 'test',
      author: 'Author',
      version: '1.0.0',
      category: 'Outro',
      tags: [],
      compatibleAgents: ['generic'],
      instructions: 'instructions',
      dependencies: [],
      permissions: [],
      lastUpdated: new Date().toISOString(),
      demo: false,
      createdAt: new Date().toISOString(),
    }
    addResource(resource)
    expect(getResources().length).toBe(before + 1)
    expect(getResourceOrThrow('test-1').title).toBe('Test Prompt')

    updateResource('test-1', { title: 'Updated' })
    expect(getResourceOrThrow('test-1').title).toBe('Updated')

    deleteResource('test-1')
    expect(getResources().length).toBe(before)
  })

  it('toggles favorites', () => {
    const id = getResources()[0].id
    expect(isFavorite(id)).toBe(false)
    toggleFavorite(id)
    expect(isFavorite(id)).toBe(true)
    expect(getFavorites().length).toBe(1)
    toggleFavorite(id)
    expect(isFavorite(id)).toBe(false)
  })
})

function getResourceOrThrow(id: string) {
  const r = getResources().find((x) => x.id === id)
  if (!r) throw new Error('not found')
  return r
}
