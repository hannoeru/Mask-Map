import { describe, expect, it } from 'vitest'
import { isOpen, purchaseDayLabel } from './pharmacyStatus'

const DAYS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const PERIODS = ['上午', '下午', '晚上']

function availability(openIndexes: number[]) {
  const parts: string[] = []
  PERIODS.forEach((period, periodIndex) => {
    DAYS.forEach((day, dayIndex) => {
      const index = periodIndex * 7 + dayIndex
      parts.push(`${day}${period}${openIndexes.includes(index) ? '看診' : '休診'}`)
    })
  })
  return parts.join('、')
}

describe('isOpen', () => {
  const wednesdayMorning = availability([2])

  it('treats the schedule as Monday-first', () => {
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 14, 10, 0))).toBe('營業中')
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 13, 10, 0))).toBe('休息中')
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 11, 10, 0))).toBe('休息中')
  })

  it('uses morning, afternoon, and evening windows', () => {
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 14, 3, 30))).toBe('營業中')
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 14, 12, 0))).toBe('營業中')
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 14, 3, 29))).toBe('休息中')
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 14, 12, 30))).toBe('休息中')
    expect(isOpen(wednesdayMorning, new Date(2026, 9, 14, 19, 0))).toBe('休息中')

    const wednesdayEvening = availability([16])
    expect(isOpen(wednesdayEvening, new Date(2026, 9, 14, 18, 0))).toBe('營業中')
    expect(isOpen(wednesdayEvening, new Date(2026, 9, 14, 20, 30))).toBe('營業中')
    expect(isOpen(wednesdayEvening, new Date(2026, 9, 14, 20, 31))).toBe('休息中')

    const wednesdayAfternoon = availability([9])
    expect(isOpen(wednesdayAfternoon, new Date(2026, 9, 14, 13, 30))).toBe('營業中')
    expect(isOpen(wednesdayAfternoon, new Date(2026, 9, 14, 17, 0))).toBe('營業中')
    expect(isOpen(wednesdayAfternoon, new Date(2026, 9, 14, 13, 29))).toBe('休息中')
  })

  it('returns 未知 for empty or short schedules', () => {
    expect(isOpen('')).toBe('未知')
    expect(isOpen(null)).toBe('未知')
    expect(isOpen('星期一上午看診')).toBe('未知')
  })
})

describe('purchaseDayLabel', () => {
  it('follows the odd, even, and Sunday rules', () => {
    expect(purchaseDayLabel(new Date(2026, 9, 11, 12, 0))).toBe('不限')
    expect(purchaseDayLabel(new Date(2026, 9, 14, 12, 0))).toBe('奇數')
    expect(purchaseDayLabel(new Date(2026, 9, 13, 12, 0))).toBe('偶數')
  })
})
