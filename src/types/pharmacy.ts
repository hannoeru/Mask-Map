import type { Feature, Point } from 'geojson'

export interface PharmacyProperties {
  id: string | number
  name?: string
  phone?: string
  address?: string
  mask_adult?: number | string
  mask_child?: number | string
  available?: string
  note?: string
  custom_note?: string
  county?: string
  updated?: string
}

export type PharmacyFeature = Feature<Point, PharmacyProperties>

export interface CityCatalog {
  counties: string[]
  districts: Array<[string[], string[]]>
}
