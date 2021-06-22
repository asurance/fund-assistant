import { render } from 'react-dom'
import React from 'react'
import App from '../email'

const ttm = new Map<string, number[]>([
  ['行业一', [1, 2, 3, 4, 5]],
  ['行业二', [5, 4, 3, 2, 1]],
  ['行业三', [1]],
  ['行业四', []],
])

const funds = {
  test: [-1.5],
}

render(<App ttm={ttm} funds={funds} />, document.getElementById('container'))
