import React, { FC } from 'react'
import { FundData } from '../interfaces/fund'
import { TransformCumulate } from '../utils/util'
import { cell, GetChangePercentColor } from './style'

type FundProps = {
  name: string
  code: string
  data: FundData | null
}

const Fund: FC<FundProps> = ({ name, code, data }: FundProps) => {
  return (
    <tr>
      <td style={cell}>{`${name}(${code})`}</td>
      {data === null ? (
        <td>获取数据失败</td>
      ) : (
        <td
          style={{ ...cell, color: GetChangePercentColor(data.acc) }}
        >{`${data.acc.toFixed(2)}(${TransformCumulate(data.cumulate)})%`}</td>
      )}
    </tr>
  )
}

export default Fund
