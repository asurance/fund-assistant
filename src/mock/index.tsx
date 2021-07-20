import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import { FundData } from '../interfaces/fund'

const funds = new Map<string, FundData>([
  ['农银新能源主题', { cur: 1, acc: 3 }],
])

render(<App funds={funds} />, document.getElementById('container'))
