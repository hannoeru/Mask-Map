// Availability strings are 21 segments: Mon–Sun morning, then afternoon, then evening.
// JavaScript's getDay() is Sunday-first, so Sunday maps to the last column.
const DAY_INDEX = [6, 0, 1, 2, 3, 4, 5]

export function purchaseDayLabel(date = new Date()) {
  const day = date.getDay()
  if (day === 0)
    return '不限'
  return day % 2 !== 0 ? '奇數' : '偶數'
}

export function isOpen(available: unknown, date = new Date()) {
  if (typeof available !== 'string' || available === '')
    return '未知'
  const slots = available.split('、').map(part => part.slice(5) === '看診')
  if (slots.length < 21)
    return '未知'

  const minutes = date.getHours() * 60 + date.getMinutes()
  let zone = -1
  if (minutes >= 210 && minutes <= 720)
    zone = 0
  else if (minutes >= 810 && minutes <= 1020)
    zone = 1
  else if (minutes >= 1080 && minutes <= 1230)
    zone = 2
  if (zone === -1)
    return '休息中'

  const dayIndex = DAY_INDEX[date.getDay()] ?? 0
  return slots[zone * 7 + dayIndex] ? '營業中' : '休息中'
}
