import styled from 'styled-components'
import React, { FC, ReactNode } from 'react'
import { CenterDiv } from './common'

const CardContainer = styled.div`
  border-radius: 1em;
  padding: 0.8em;
  border: 1px solid;
`
const CardTitle = styled(CenterDiv)`
  font-weight: bold;
  border: 0px solid;
  border-bottom-width: 1px;
  padding-bottom: 0.2em;
`

const CardMain = styled.div`
  padding-top: 0.2em;
`

type CardProps = {
  title: string
  ContainerStyle?: FC
  TitleStyle?: FC
  MainStyle?: FC
  children?: ReactNode
}
const Card: FC<CardProps> = ({
  title,
  children,
  ContainerStyle = CardContainer,
  TitleStyle = CardTitle,
  MainStyle = CardMain,
}: CardProps) => (
  <ContainerStyle>
    <TitleStyle>{title}</TitleStyle>
    <MainStyle>{children}</MainStyle>
  </ContainerStyle>
)
export default Object.assign(Card, {
  Container: CardContainer,
  Title: CardTitle,
  Main: CardMain,
})
