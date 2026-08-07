import { describe, expect, it } from 'vitest'
import { buildPriceImportItems, normalizePriceImportDrafts } from './price-import'

const draft = {
  id: '1',
  item_name: ' Shirt ',
  suggested_price: 12.5,
  category: 'Tops',
  confidence: 0.9,
  is_selected: true,
}

describe('price import helpers', () => {
  it('normalizes suggested prices for editable inputs', () => {
    expect(normalizePriceImportDrafts([draft])[0].unit_price).toBe('12.5')
    expect(normalizePriceImportDrafts([{ ...draft, suggested_price: null }])[0].unit_price).toBe('')
  })

  it('builds a trimmed payload from selected complete rows only', () => {
    const rows = normalizePriceImportDrafts([
      draft,
      { ...draft, id: '2', item_name: 'Ignored', is_selected: false },
      { ...draft, id: '3', item_name: 'No price', suggested_price: null },
    ])
    expect(buildPriceImportItems(rows)).toEqual([
      { item_name: 'Shirt', unit_price: '12.5', category: 'Tops' },
    ])
  })
})
