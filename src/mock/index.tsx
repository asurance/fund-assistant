import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import { FundData, FundInfo } from '../interfaces/fund'

const funds: [FundInfo, FundData | null][] = [
  [
    { name: '农银新能源', code: '001', subject: [''] },
    { acc: 3, cumulate: [1, 3, -1] },
  ],
]

render(
  <App
    attm={{
      now: 100,
      orderRatio: {
        from: 30,
        to: 30,
      },
    }}
    funds={funds}
  />,
  document.getElementById('container'),
)
