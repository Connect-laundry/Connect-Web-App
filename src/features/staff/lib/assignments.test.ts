import { describe, expect, it } from 'vitest'
import { getAssignmentTypes } from './assignments'

describe('getAssignmentTypes', () => {
  it('expands both into backend-supported pickup and delivery assignments', () => {
    expect(getAssignmentTypes('BOTH')).toEqual(['PICKUP', 'DELIVERY'])
  })

  it('keeps a single backend-supported assignment type', () => {
    expect(getAssignmentTypes('PICKUP')).toEqual(['PICKUP'])
  })
})
