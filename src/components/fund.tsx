import React, { FC } from 'react'
import { cell, GetChangePercentColor } from './style'

type FundProps = {
  name: string
  cur: number
  acc: number
}

const Fund: FC<FundProps> = ({ name, cur, acc }: FundProps) => {
  return (
    <tr>
      <td style={cell}>{name}</td>
      <td
        style={{ ...cell, color: GetChangePercentColor(cur) }}
      >{`${cur.toFixed(2)}%`}</td>
      <td
        style={{ ...cell, color: GetChangePercentColor(acc) }}
      >{`${acc.toFixed(2)}%`}</td>
    </tr>
  )
}

export default Fund
