import React, { FC } from 'react'
import { cell } from './style'

type TTMProps = {
  industry: string
  ttm: number[]
}

const TTM: FC<TTMProps> = ({ industry, ttm }: TTMProps) => {
  if (ttm.length === 0) {
    return (
      <tr>
        <td style={cell}>{industry}</td>
        <td style={cell} colSpan={4}>
          缺失数据
        </td>
      </tr>
    )
  } else if (ttm.length === 1) {
    return (
      <tr>
        <td style={cell}>{industry}</td>
        <td style={cell}>{ttm[0]}</td>
      </tr>
    )
  } else {
    const today = ttm[ttm.length - 1]
    const last = ttm[ttm.length - 2]
    ttm.sort((a, b) => a - b)
    return (
      <tr>
        <td style={cell}>{industry}</td>
        <td style={cell}>{today}</td>
        <td style={cell}>{`${(((today - last) / last) * 100).toFixed(2)}%`}</td>
        <td style={cell}>{`${
          ((ttm.indexOf(today) + 1) / ttm.length) * 100
        }%`}</td>
        <td style={cell}>{`${
          ((today - ttm[0]) / (ttm[ttm.length - 1] - ttm[0])) * 100
        }%`}</td>
      </tr>
    )
  }
}

export default TTM