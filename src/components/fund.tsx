import React, { FC } from 'react'
import { FundInfoMap } from '../config'
import { FundData } from '../interfaces/fund'
import { cell, GetChangePercentColor } from './style'

type FundProps = {
  name: string
  data: FundData | null
}

const Fund: FC<FundProps> = ({ name, data }: FundProps) => {
  const code = FundInfoMap.get(name)?.code ?? 'unknown'
  return (
    <tr>
      <td style={cell}>{`${name}(${code})`}</td>
      {data === null ? (
        <td colSpan={2}>获取数据失败</td>
      ) : (
        <>
          <td
            style={{ ...cell, color: GetChangePercentColor(data.cur) }}
          >{`${data.cur.toFixed(2)}%`}</td>
          <td
            style={{ ...cell, color: GetChangePercentColor(data.acc) }}
          >{`${data.acc.toFixed(2)}%`}</td>
        </>
      )}
    </tr>
  )
}

export default Fund
