/* eslint-disable react-hooks/rules-of-hooks */
import axios from 'axios'
import { SentMessageInfo } from 'nodemailer'
import { Browser } from 'puppeteer'
import { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Empty } from '../util'
import { useDingDingRobot } from './useDingDingRobot'
import { useEmail } from './useEmail'
import { usePromiseQueue } from './usePromiseList'
import { usePage } from './usePuppeteer'
import { useRetryPromise } from './useRetryPromise'

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

const pageQueue = usePromiseQueue(5)

const predictSelector = '#fund_gszf'
const historySelector = '#jztable > table > tbody > tr > td:nth-child(4)'

export function Search(browser: Browser, fundCode: string): Promise<number[]> {
  return pageQueue.push(() => {
    return new Promise<number[]>((resolve, reject) => {
      useRetryPromise(
        () =>
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
          }),
        3,
      )
        .then(resolve)
        .catch(reject)
    })
  })
}
