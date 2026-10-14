/** Cubic ease-in-out from `start` down to 0 over `duration` milliseconds. */
export function easedScrollTop(start: number, elapsed: number, duration: number): number {
  if (start <= 0 || duration <= 0 || elapsed >= duration)
    return 0
  if (elapsed <= 0)
    return start
  const t = elapsed / duration
  const eased = t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
  return start * (1 - eased)
}
