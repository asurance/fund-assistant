/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import { SentMessageInfo } from 'nodemailer'
import { Browser } from 'puppeteer'
import { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { Empty } from '../util'
import { useDingDingRobot } from './useDingDingRobot'
import { useEmail } from './useEmail'
import { usePromiseQueue } from './usePromiseList'
import { usePage } from './usePuppeteer'

export { useBrowser } from './usePuppeteer'

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

const pageQueue = usePromiseQueue(5)

const predictSelector = '#fund_gszf'
const historySelector = '#jztable > table > tbody > tr > td:nth-child(4)'

export function Search(browser: Browser, fundCode: string): Promise<number[]> {
  return pageQueue.push(() => {
    return new Promise<number[]>((resolve) => {
      usePage(browser, async (page) => {
        page
          .goto(`http://fundf10.eastmoney.com/jjjz_${fundCode}.html`)
          .catch(Empty)
        const predictPromise = page
          .waitForSelector(predictSelector)
          .then(() => {
            return page.$eval(predictSelector, (element) =>
              parseFloat(element.textContent!),
            )
          })
        const historyPromise = page
          .waitForSelector(historySelector)
          .then(() => {
            return page.$$eval(historySelector, (elements) =>
              elements.map((element) => parseFloat(element.textContent!)),
            )
          })
        const [predict, history] = await Promise.all([
          predictPromise,
          historyPromise,
        ])
        return [predict, ...history].filter((value) => !isNaN(value))
      }).then(resolve)
    })
  })
}
