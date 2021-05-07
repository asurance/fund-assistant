import styled from 'styled-components'
import React, { FC, ReactNode } from 'react'
import { CenterDiv } from './common'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Header = styled(CenterDiv)`
  font-size: 2em;
  background-color: #0ee20e;
  color: white;
  border-radius: 0 0 0.5em 0.5em;
  padding: 0.5em;
`

const Main = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
`

type Props = {
  children?: ReactNode
}

const Layout: FC<Props> = ({ children }: Props) => (
  <Container>
    <Header>基金日报</Header>
    <Main>{children}</Main>
  </Container>
)

export default Layout
