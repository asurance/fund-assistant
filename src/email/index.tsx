import React, { FC } from 'react'
import styled from 'styled-components'
import Card from '../components/card'
import Layout from '../components/layout'
import { TTMData } from '../interfaces/ttm'

type Props = {
  data: TTMData[]
  funds: { [name: string]: number[] }
}

const CardContainer = styled(Card.Container)`
  min-width: 200px;
  box-sizing: border-box;
  margin: 0.2em;
`

const WrapContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

function GetTTMContainer(data: TTMData[]) {
  if (data.length >= 2) {
    const pre = data[data.length - 2]
    const now = data[data.length - 1]
    return (
      <>
        <Card title="昨日ttm" ContainerStyle={CardContainer}>
          {pre.averagePETTM}
        </Card>
        <Card title="今日ttm" ContainerStyle={CardContainer}>
          {now.averagePETTM}
        </Card>
      </>
    )
  } else {
    return <Card title="ttm数据">ttm数据缺失</Card>
  }
}

function GetFundInfo(fund: number[]) {
  if (fund.length === 0) return '数据异常'
  let sum = fund[0]
  for (let i = 1; i < fund.length; i++) {
    const f = fund[i]
    if (isNaN(f)) {
      return '数据异常'
    }
    if (sum * f < 0) {
      return `当前估值连续变化幅度累计${sum}%`
    }
    sum += f
  }
  return `当前估值连续变化幅度累计${sum}%`
}

function GetFundsContainer(funds: { [name: string]: number[] }) {
  return (
    <>
      {Object.keys(funds).map((fundCode) => (
        <Card key={fundCode} title={fundCode}>
          {GetFundInfo(funds[fundCode])}
        </Card>
      ))}
    </>
  )
}

const App: FC<Props> = ({ data, funds }: Props) => {
  return (
    <Layout>
      <WrapContainer>
        {GetTTMContainer(data)}
        {GetFundsContainer(funds)}
      </WrapContainer>
    </Layout>
  )
}

export default App
