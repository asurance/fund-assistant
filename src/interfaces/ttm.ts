export type ATTMData = {
  averagePELYR: number
  averagePETTM: number
  close: number
  date: number
  marketId: string
  middlePELYR: number
  middlePETTM: number
}

export type ParsedTTMData = {
  now: number
  orderRatio: {
    from: number
    to: number
  } | null
}
