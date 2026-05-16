const unitMap: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000
}

export const durationToDate = (duration: string, baseDate: Date = new Date()): Date => {
  const match = duration.match(/^(\d+)(s|m|h|d)$/)

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`)
  }

  return new Date(baseDate.getTime() + Number(match[1]) * unitMap[match[2]])
}
