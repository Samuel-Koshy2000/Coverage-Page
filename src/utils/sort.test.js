import { describe, it, expect } from 'vitest'
import { stableSort } from './sort.js'

const items = [
  { name: 'Bolt',    status: 'Working' },
  { name: 'Amazon',  status: 'Coming soon' },
  { name: 'Fiverr',  status: 'Working' },
  { name: 'Amazon',  status: 'Working' },   // duplicate name — tests stability
]

describe('stableSort', () => {
  it('sorts ascending by name', () => {
    const result = stableSort(items, 'name', 'asc')
    expect(result.map(r => r.name)).toEqual(['Amazon', 'Amazon', 'Bolt', 'Fiverr'])
  })

  it('sorts descending by name', () => {
    const result = stableSort(items, 'name', 'desc')
    expect(result.map(r => r.name)).toEqual(['Fiverr', 'Bolt', 'Amazon', 'Amazon'])
  })

  it('is stable: equal elements preserve original order', () => {
    const result = stableSort(items, 'name', 'asc')
    const amazons = result.filter(r => r.name === 'Amazon')
    expect(amazons[0].status).toBe('Coming soon')
    expect(amazons[1].status).toBe('Working')
  })

  it('does not mutate the original array', () => {
    const original = [...items]
    stableSort(items, 'name', 'asc')
    expect(items).toEqual(original)
  })

  it('handles empty array', () => {
    expect(stableSort([], 'name', 'asc')).toEqual([])
  })

  it('sorts by status', () => {
    const result = stableSort(items, 'status', 'asc')
    expect(result[0].status).toBe('Coming soon')
  })
})
