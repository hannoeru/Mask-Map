import type { PharmacyFeature } from '@/types/pharmacy'
import { describe, expect, it } from 'vitest'
import cities from '../data/cities'
import {
  districtsFor,
  filterPharmacies,
  latestUpdateTime,
  mapSearchUrl,
  parseMaskFeatures,
} from './pharmacies'

function pharmacy(partial: {
  id: number
  county?: string
  address?: string
  adult?: number
  updated?: string
  name?: string
}): PharmacyFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [121.5, 25.0] },
    properties: {
      id: partial.id,
      county: partial.county,
      address: partial.address,
      mask_adult: partial.adult,
      updated: partial.updated,
      name: partial.name,
    },
  }
}

describe('parseMaskFeatures', () => {
  it('rejects payloads without a features array', () => {
    expect(() => parseMaskFeatures(null)).toThrow(/features/)
    expect(() => parseMaskFeatures({})).toThrow(/features/)
    expect(() => parseMaskFeatures({ features: null })).toThrow(/features/)
  })

  it('accepts a feature collection', () => {
    const features = parseMaskFeatures({
      features: [pharmacy({ id: 1, county: '臺北市' })],
    })
    expect(features).toHaveLength(1)
    expect(features[0]?.properties.id).toBe(1)
  })
})

describe('filterPharmacies', () => {
  const rows = [
    pharmacy({ id: 1, county: '臺北市', address: '台北市中正區', adult: 10 }),
    pharmacy({ id: 2, county: '台北市', address: '台北市內湖區港墘路', adult: 50 }),
    pharmacy({ id: 3, county: '', address: '台北市內湖區', adult: 99 }),
    pharmacy({ id: 4, county: '基隆市', address: '基隆市仁愛區', adult: 5 }),
  ]

  it('matches 臺 and 台, filters by district, and sorts adult stock descending', () => {
    expect(filterPharmacies(rows, '台北市', '').map(item => item.properties.id)).toEqual([2, 1])
    expect(filterPharmacies(rows, '台北市', '內湖區').map(item => item.properties.id)).toEqual([2])
    expect(filterPharmacies(rows, '基隆市', '')).toHaveLength(1)
  })
})

describe('latestUpdateTime', () => {
  it('uses the first non-empty timestamp', () => {
    expect(latestUpdateTime([
      pharmacy({ id: 1, updated: '' }),
      pharmacy({ id: 2, updated: '2022/03/09 22:53:23' }),
    ])).toBe('2022/03/09 22:53:23')
    expect(latestUpdateTime([pharmacy({ id: 1, updated: '' })])).toBe('None')
  })
})

describe('districtsFor', () => {
  it('returns district names for a known city and an empty list otherwise', () => {
    expect(districtsFor(cities, '台北市')).toContain('內湖區')
    expect(districtsFor(cities, '不存在市')).toEqual([])
  })
})

describe('mapSearchUrl', () => {
  it('encodes the pharmacy name and address', () => {
    expect(mapSearchUrl({ name: '思恩藥局', address: '台北市內湖區' }))
      .toBe(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('思恩藥局 台北市內湖區')}`)
  })
})
