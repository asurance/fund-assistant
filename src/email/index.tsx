import React, { FC } from 'react'
import styled from 'styled-components'
import { CenterDiv } from '../components/common'
import Card from '../components/card'
import Layout from '../components/layout'
import { TTMData } from '../interfaces/ttm'

type Props = {
  data: TTMData[]
  fund: number[]
}

const CardContainer = styled(Card.Container)`
  width: calc(50% - 0.4em);
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
      <WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Card title="昨日ttm" ContainerStyle={CardContainer}>
          {pre.averagePETTM}
        </Card>
        <Card title="今日ttm" ContainerStyle={CardContainer}>
          {now.averagePETTM}
        </Card>
      </WrapContainer>
    )
  } else {
    return <CenterDiv>ttm数据缺失</CenterDiv>
  }
}

function GetFundContainer(fund: number[]) {
  let sum = 0
  for (const f of fund) {
    if (isNaN(f)) {
      return <CenterDiv>数据异常</CenterDiv>
    }
    if (sum * f < 0) {
      sum = 0
    }
    sum += f
  }
  return <CenterDiv>{`当前估值连续变化幅度累计${sum}%`}</CenterDiv>
}

const App: FC<Props> = ({ data, fund }: Props) => {
  return (
    <Layout>
      {GetTTMContainer(data)}
      {GetFundContainer(fund)}
    </Layout>
  )
}

export default App
