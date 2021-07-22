import React, { FC } from 'react'
import { ParsedTTMData } from '../interfaces/ttm'
import { cell, GetChangePercentColor, highLightColor } from './style'

type Props = {
  ttm: ParsedTTMData | null
}

const Attm: FC<Props> = ({ ttm }: Props) => {
  if (ttm) {
    if (ttm.extra) {
      const { upRatio, orderRatio, difRatio } = ttm.extra
      return (
        <tr>
          <td style={cell}>A股</td>
          <td style={cell}>{ttm.now}</td>
          <td
            style={{
              ...cell,
              color: GetChangePercentColor(upRatio),
            }}
          >{`${upRatio.toFixed(2)}%`}</td>
          <td
            style={{
              ...cell,
              color: highLightColor(orderRatio),
            }}
          >{`${orderRatio.toFixed(2)}%`}</td>
          <td
            style={{
              ...cell,
              color: highLightColor(difRatio),
            }}
          >{`${difRatio.toFixed(2)}%`}</td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td style={cell}>A股</td>
          <td style={cell}>{ttm.now}</td>
          <td style={cell} colSpan={3}>
            缺失数据
          </td>
        </tr>
      )
    }
  } else {
    return (
      <tr>
        <td style={cell}>A股</td>
        <td style={cell} colSpan={4}>
          缺失数据
        </td>
      </tr>
    )
  }
}

export default Attm
