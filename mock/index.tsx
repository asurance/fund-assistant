import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import { ttm } from '../data.json'
import { TTMType } from '../interfaces/ttm'

render(
  <App ttm={ttm} type={TTMType.high} />,
  document.getElementById('container'),
)
