import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import { FundData } from '../interfaces/fund'

const funds: [string, FundData | null][] = [
  ['农银新能源', { acc: 3, cumulate: [1, 3, -1] }],
]

render(
  <App
    attm={{
      now: 100,
      extra: {
        upRatio: 1,
        orderRatio: -50,
        difRatio: 50,
      },
    }}
    funds={funds}
  />,
  document.getElementById('container'),
)
