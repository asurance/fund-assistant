import { createTransport } from 'nodemailer'
import { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

export async function SendEmail(subject: string, html: string): Promise<void> {
  const transporter = createTransport({
    service: 'QQ',
    port: 465,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  })

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject,
    html,
  }

  transporter.sendMail(mailOptions)
}

export function GetMailContent(root: ReactNode): string {
  const sheet = new ServerStyleSheet()
  const content = renderToStaticMarkup(sheet.collectStyles(root))
  return `${sheet.getStyleTags()}${content}`
}
