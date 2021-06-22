/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import { SentMessageInfo } from 'nodemailer'
import { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { useDingDingRobot } from './useDingDingRobot'
import { useEmail } from './useEmail'
import { usePromiseQueue } from './usePromiseList'

export const dingdingRobot = useDingDingRobot(process.env.DING_DING_TOKEN!)

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
  root: ReactNode,
): Promise<SentMessageInfo> {
  const sheet = new ServerStyleSheet()
  const divContent = renderToStaticMarkup(sheet.collectStyles(root))
  return email.sendEmail({
    from: process.env.FROM_EMAIL,
    to: process.env.TO_EMAIL,
    subject,
    html: `${sheet.getStyleTags()}${divContent}`,
  })
}

const httpQueue = usePromiseQueue(5)

export function Request<T>(url: string): Promise<T> {
  return httpQueue.push(() => {
    return new Promise<T>((resolve) => {
      axios(url).then((data) => resolve(data.data))
    })
  })
}
