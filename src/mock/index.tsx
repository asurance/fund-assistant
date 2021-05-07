import { render } from 'react-dom'
import React from 'react'
import App from '../email'
import data from '../../data.json'

render(<App data={data} />, document.getElementById('container'))
