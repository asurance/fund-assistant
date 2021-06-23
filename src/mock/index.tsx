import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import { FundData } from '../interfaces/fund'

const ttm = new Map<string, number[]>([
  ['采矿业', [1, 2, 3, 4, 5]],
  ['制造业', [5, 4, 3, 2, 1]],
  ['建筑业', [1]],
  ['金融业', []],
])

const funds = new Map<string, FundData>([
  ['农银新能源主题', { cur: 1, acc: 3 }],
])

render(<App ttm={ttm} funds={funds} />, document.getElementById('container'))
