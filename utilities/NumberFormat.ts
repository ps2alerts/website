// 6396528 -> "6.39M", 207255 -> "207k", 7063 -> "7,063"
export const abbreviate = (value: number): string => {
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`
  }

  if (abs >= 10_000) {
    return `${Math.round(value / 1_000)}k`
  }

  return Math.round(value).toLocaleString('en-GB')
}

// K/D with no deaths reads as the kill count, the same convention everywhere on the profiles
export const killDeathRatio = (kills: number, deaths: number): string =>
  (deaths > 0 ? kills / deaths : kills).toFixed(2)
