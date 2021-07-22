import { CSSProperties } from 'react'
import { Clamp } from '../utils/util'

export const borderColor = '#7e7e7e'

export const backgroundColor = '#ececec'

export const fontColor = '#2e2e2e'

export const center: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export const cell: CSSProperties = {
  padding: '0.6em 1.2em',
  borderTop: `1px solid ${borderColor}`,
  borderBottom: `1px solid ${borderColor}`,
}

export function highLightColor(t: number): string {
  t = Clamp(t, 0, 100)
  if (t > 50) {
    return `hsl(0,100%,${t - 50}%)`
  } else {
    return `hsl(120,100%,${50 - t}%)`
  }
}

export function GetChangePercentColor(percent: number): string {
  return highLightColor(((percent + 4) / 8) * 100)
}
