import React, { FC } from 'react'
import { ParsedTTMData } from '../interfaces/ttm'
import { cell, highLightColor } from './style'

type Props = {
  ttm: ParsedTTMData | null
}

const Attm: FC<Props> = ({ ttm }: Props) => {
  if (ttm) {
    if (ttm.orderRatio) {
      const { from, to } = ttm.orderRatio
      return (
        <tr>
          <td style={cell}>A股</td>
          <td style={cell}>{ttm.now}</td>
          <td
            style={{
              ...cell,
              color: highLightColor((from + to) / 2),
            }}
          >
            {from === to
              ? `${from.toFixed(2)}%`
              : `${from.toFixed(2)} ~ ${to.toFixed(2)}%`}
          </td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td style={cell}>A股</td>
          <td style={cell}>{ttm.now}</td>
          <td style={cell}>缺失数据</td>
        </tr>
      )
    }
  } else {
    return (
      <tr>
        <td style={cell}>A股</td>
        <td style={cell} colSpan={2}>
          缺失数据
        </td>
      </tr>
    )
  }
}

export default Attm
