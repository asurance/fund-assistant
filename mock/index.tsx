import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import { ttm } from '../data.json'

render(<App ttm={ttm} />, document.getElementById('container'))