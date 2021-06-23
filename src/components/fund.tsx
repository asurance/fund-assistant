import React, { FC } from 'react'
import { cell, highLightColor } from './style'

type FundProps = {
  name: string
  cur: number
  acc: number
}

function GetColor(val: number) {
  return highLightColor(Math.max(0, Math.min(1, (val + 4) / 8)))
}

const Fund: FC<FundProps> = ({ name, cur, acc }: FundProps) => {
  return (
    <tr>
      <td style={cell}>{name}</td>
      <td style={{ ...cell, color: GetColor(cur) }}>{`${cur.toFixed(2)}%`}</td>
      <td style={{ ...cell, color: GetColor(acc) }}>{`${acc.toFixed(2)}%`}</td>
    </tr>
  )
}

export default Fund
