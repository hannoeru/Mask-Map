import { describe, expect, it } from 'vitest'
import { easedScrollTop } from './easedScroll'

describe('easedScrollTop', () => {
  it('starts at the current offset and finishes at zero', () => {
    expect(easedScrollTop(1200, 0, 450)).toBe(1200)
    expect(easedScrollTop(1200, 450, 450)).toBe(0)
    expect(easedScrollTop(1200, 900, 450)).toBe(0)
  })

  it('moves toward the top on every sample', () => {
    const samples = [0, 40, 90, 180, 270, 360, 449, 450].map(elapsed => easedScrollTop(2000, elapsed, 450))
    for (let i = 1; i < samples.length; i++)
      expect(samples[i]).toBeLessThanOrEqual(samples[i - 1]!)
    expect(samples.at(-1)).toBe(0)
    expect(samples[1]).toBeLessThan(samples[0]!)
  })

  it('returns zero when there is nothing to scroll', () => {
    expect(easedScrollTop(0, 0, 450)).toBe(0)
    expect(easedScrollTop(-20, 10, 450)).toBe(0)
    expect(easedScrollTop(100, 10, 0)).toBe(0)
  })
})
