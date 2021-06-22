import React, { FC, ReactNode } from 'react'
import { backgroundColor, cell, center, fontColor } from '../components/style'
import TTM from '../components/ttm'

type Props = {
  ttm: Map<string, number[]>
  funds: { [name: string]: number[] }
}

const App: FC<Props> = ({ ttm }: Props) => {
  const ttms: ReactNode[] = []
  for (const [name, data] of ttm) {
    ttms.push(<TTM key={name} industry={name} ttm={data} />)
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0.8em',
        backgroundColor: backgroundColor,
        color: fontColor,
        margin: '1em',
        padding: '1em 2em 1em 2em',
      }}
    >
      <div
        style={{
          ...center,
          fontSize: '2em',
          paddingBottom: '0.2em',
        }}
      >
        基金日报
      </div>
      <table style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <th style={cell}>类别</th>
          <th style={cell}>ttm</th>
          <th style={cell}>增长百分比</th>
          <th style={cell}>超越百分比</th>
          <th style={cell}>极值百分比</th>
        </thead>
        <tbody>{ttms}</tbody>
      </table>
    </div>
  )
}

export default App
