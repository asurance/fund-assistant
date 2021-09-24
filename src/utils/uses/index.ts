/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import { SentMessageInfo } from 'nodemailer'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useDingDingRobot } from './useDingDingRobot'
import { useEmail } from './useEmail'
import { usePromiseQueue } from './usePromiseList'

export { useBrowser } from './usePuppeteer'
export { useDatabase } from './useDataBase'

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

const httpQueue = usePromiseQueue(5)

export function Request<T>(url: string): Promise<T> {
  return httpQueue.push(() => {
    return new Promise<T>((resolve, reject) => {
      axios(url)
        .then((data) => resolve(data.data))
        .catch(reject)
    })
  })
}
