import React, { FC } from 'react'
import { Red, Green } from '../components/span'
import { TTMType } from '../interfaces/ttm'

type Props = {
  ttm: number
  type: TTMType
}

const App: FC<Props> = ({ ttm, type }: Props) => (
  <span>
    当前ttm值为:
    {type === TTMType.high ? <Red>{ttm}</Red> : <Green>{ttm}</Green>}
  </span>
)

export default App
