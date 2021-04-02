import React, { FC } from 'react'
import Strong from '../components/Strong'

type Props = {
    ttm: number
}

const App: FC<Props> = ({ ttm }: Props) => (<Strong>{`当前ttm值为:${ttm}`}</Strong>)

export default App