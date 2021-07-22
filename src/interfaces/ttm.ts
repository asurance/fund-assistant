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
  extra: ExtraTTMData | null
}

export type ExtraTTMData = {
  upRatio: number
  orderRatio: number
  difRatio: number
}
