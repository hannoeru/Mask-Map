import type { CityCatalog, PharmacyFeature, PharmacyProperties } from '@/types/pharmacy'

export function maskCount(value: unknown) {
  const count = Number(value)
  return Number.isFinite(count) ? count : 0
}

export function stockClass(value: unknown) {
  const count = Number(value)
  if (!Number.isFinite(count) || count === 0)
    return 'none'
  if (count < 1000)
    return 'bad'
  return 'good'
}

export function countyName(feature: PharmacyFeature) {
  return String(feature.properties?.county ?? '').replace(/臺/g, '台')
}

export function hasCoordinates(feature: PharmacyFeature) {
  const coordinates = feature?.geometry?.coordinates
  if (!Array.isArray(coordinates))
    return false
  return Number.isFinite(Number(coordinates[0])) && Number.isFinite(Number(coordinates[1]))
}

export function mapSearchUrl(properties?: Pick<PharmacyProperties, 'name' | 'address'>) {
  const query = `${properties?.name ?? ''} ${properties?.address ?? ''}`.trim()
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function telHref(phone: unknown) {
  if (!phone)
    return ''
  return `tel:${String(phone).replace(/\s*/g, '')}`
}

export function filterPharmacies(rows: readonly PharmacyFeature[], city: string, district: string) {
  return rows
    .filter((item) => {
      if (countyName(item) !== city)
        return false
      if (!district)
        return true
      const address = String(item.properties?.address ?? '').replace(/臺/g, '台')
      return address.includes(district)
    })
    .sort((a, b) => maskCount(b.properties?.mask_adult) - maskCount(a.properties?.mask_adult))
}

export function latestUpdateTime(rows: readonly PharmacyFeature[]) {
  for (const row of rows) {
    const time = row.properties?.updated
    if (time)
      return time
  }
  return 'None'
}

export function districtsFor(catalog: CityCatalog, city: string) {
  const index = catalog.counties.indexOf(city)
  if (index < 0)
    return []
  return catalog.districts[index]?.[0] ?? []
}

export function parseMaskFeatures(payload: unknown): PharmacyFeature[] {
  if (typeof payload !== 'object' || payload === null || !('features' in payload) || !Array.isArray(payload.features))
    throw new Error('Mask API response did not include features')
  return payload.features as PharmacyFeature[]
}
