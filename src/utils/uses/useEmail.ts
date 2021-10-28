import { createTransport, SentMessageInfo } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const email = useEmail({
  service: 'QQ',
  port: 465,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
})

export function SendEmail(
  subject: string,
  root: ReactElement,
): Promise<SentMessageInfo> {
  const divContent = renderToStaticMarkup(root)
  return email.sendEmail({
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject,
    html: divContent,
  })
}

export function useEmail(option: SMTPTransport.Options): {
  sendEmail: (mailOptions: Mail.Options) => Promise<SentMessageInfo>
} {
  const transporter = createTransport(option)
  return {
    sendEmail: (mailOptions: Mail.Options) => {
      return transporter.sendMail(mailOptions)
    },
  }
}
