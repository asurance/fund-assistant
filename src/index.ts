import { createTransport } from 'nodemailer'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { ServerStyleSheet } from 'styled-components'
import App from '../email'

const sheet = new ServerStyleSheet()

const content = renderToStaticMarkup(sheet.collectStyles(createElement(App)))

const html = `${sheet.getStyleTags()}${content}`

const transporter = createTransport({
    service: 'QQ',
    port: 465,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    }
})

const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject: 'Hello',
    html,
}

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
})