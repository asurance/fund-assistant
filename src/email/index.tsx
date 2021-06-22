import React, { FC, ReactNode } from 'react'
import { backgroundColor, cell, center, fontColor } from '../components/style'
import { FundData } from '../interfaces/fund'
import TTM from '../components/ttm'
import Fund from '../components/fund'

type Props = {
  ttm: Map<string, number[]>
  funds: Map<string, FundData>
}

const App: FC<Props> = ({ ttm, funds }: Props) => {
  const ttms: ReactNode[] = []
  for (const [name, data] of ttm) {
    ttms.push(<TTM key={name} industry={name} ttm={data} />)
  }
  const fundNode: ReactNode[] = []
  for (const [name, { cur, acc }] of funds) {
    fundNode.push(<Fund key={name} name={name} cur={cur} acc={acc} />)
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
          <tr>
            <th style={cell}>类别</th>
            <th style={cell}>ttm</th>
            <th style={cell}>增长百分比</th>
            <th style={cell}>超越百分比</th>
            <th style={cell}>极值百分比</th>
          </tr>
        </thead>
        <tbody>{ttms}</tbody>
      </table>
      <table
        style={{
          marginTop: '1rem',
          borderCollapse: 'collapse',
          textAlign: 'center',
        }}
      >
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th style={cell}>基金名称</th>
            <th style={cell}>当前涨幅</th>
            <th style={cell}>累计涨幅</th>
          </tr>
        </thead>
        <tbody>{fundNode}</tbody>
      </table>
    </div>
  )
}

export default App
