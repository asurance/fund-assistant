import { CSSProperties } from 'react'

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
