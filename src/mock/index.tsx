import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import data from '../../data.json'

const fund = [-1.5]

render(<App data={data} fund={fund} />, document.getElementById('container'))
