import { CSSProperties } from 'react'
import { ClampTo01 } from '../utils/util'

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
  t = ClampTo01(t)
  if (t > 0.5) {
    return `hsl(0,100%,${(t - 0.5) * 2 * 50}%)`
  } else {
    return `hsl(120,100%,${(0.5 - t) * 2 * 50}%)`
  }
}

export function GetChangePercentColor(percent: number): string {
  return highLightColor((percent + 4) / 8)
}
