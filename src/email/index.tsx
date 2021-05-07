import React, { FC } from 'react'
import styled from 'styled-components'
import { CenterDiv } from '../components/common'
import Card from '../components/card'
import Layout from '../components/layout'
import { TTMData } from '../interfaces/ttm'

type Props = {
  data: TTMData[]
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

const App: FC<Props> = ({ data }: Props) => {
  if (data.length >= 2) {
    const pre = data[data.length - 2]
    const now = data[data.length - 1]
    return (
      <Layout>
        <WrapContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Card title="昨日ttm" ContainerStyle={CardContainer}>
            {pre.averagePETTM}
          </Card>
          <Card title="今日ttm" ContainerStyle={CardContainer}>
            {now.averagePETTM}
          </Card>
        </WrapContainer>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <CenterDiv style={{ display: 'flex' }}>ttm数据缺失</CenterDiv>
      </Layout>
    )
  }
}

export default App
