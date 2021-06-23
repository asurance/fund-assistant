import React, { FC } from 'react'
import { FundInfoMap } from '../config'
import { cell, GetChangePercentColor } from './style'

type FundProps = {
  name: string
  cur: number
  acc: number
}

const Fund: FC<FundProps> = ({ name, cur, acc }: FundProps) => {
  const code = FundInfoMap.get(name)?.code ?? 'unknown'
  return (
    <tr>
      <td style={cell}>{`${name}(${code})`}</td>
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
