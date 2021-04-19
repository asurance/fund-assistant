import { createTransport, SentMessageInfo } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export function useEmail(
  option: SMTPTransport.Options,
): {
  sendEmail: (mailOptions: Mail.Options) => Promise<SentMessageInfo>
} {
  const transporter = createTransport(option)
  return {
    sendEmail: (mailOptions: Mail.Options) => {
      return transporter.sendMail(mailOptions)
    },
  }
}
