import { render } from 'react-dom'
import React from 'react'
import App from '../email'

const data = [
  {
    date: 1620172800000,
    middlePETTM: 30.65,
    averagePETTM: 43.94,
    middlePELYR: 35.28,
    averagePELYR: 50.67,
    close: 5123.49,
    marketId: '5',
  },
  {
    date: 1620259200000,
    middlePETTM: 30.82,
    averagePETTM: 43.79,
    middlePELYR: 35.36,
    averagePELYR: 50.76,
    close: 5061.12,
    marketId: '5',
  },
]

const funds = {
  test: [-1.5],
}

render(<App data={data} funds={funds} />, document.getElementById('container'))
