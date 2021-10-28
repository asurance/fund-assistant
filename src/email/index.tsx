import React, { FC, ReactNode } from 'react'
import { backgroundColor, cell, center, fontColor } from '../components/style'
import { FundData, FundInfo } from '../interfaces/fund'
import Fund from '../components/fund'
import Attm from '../components/attm'
import { ParsedTTMData } from '../interfaces/ttm'

type Props = {
  attm: ParsedTTMData | null
  funds: [FundInfo, FundData | null][]
}

const App: FC<Props> = ({ attm, funds }: Props) => {
  const fundNode: ReactNode[] = []
  for (const [info, data] of funds) {
    fundNode.push(
      <Fund key={info.code} code={info.code} name={info.name} data={data} />,
    )
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
            <th style={cell}>百分比</th>
          </tr>
        </thead>
        <tbody>
          <Attm ttm={attm} />
        </tbody>
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
        </colgroup>
        <thead>
          <tr>
            <th style={cell}>基金名称</th>
            <th style={cell}>累计涨幅</th>
          </tr>
        </thead>
        <tbody>{fundNode}</tbody>
      </table>
    </div>
  )
}

export default App
