/* eslint-disable react-hooks/rules-of-hooks */
import { SentMessageInfo } from 'nodemailer'
import { resolve } from 'path'
import { launch } from 'puppeteer'
import { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { useCache } from './uses/useCache'
import { useDingDingRobot } from './uses/useDingDingRobot'
import { useEmail } from './uses/useEmail'

const selector =
  'body > div.lg-main > div.container.lg-container.lg-container-ad > div > div.col-md-12 > div.stock-data-center > div.data-view > div.market > div > div > div.col-md-4.market-title-data-for-index > div:nth-child(2)'

const jsonPath = resolve(__dirname, '../../data.json')

export const cache = useCache<{ ttm: number }>(jsonPath)

export const dingdingRobot = useDingDingRobot(process.env.DING_DING_TOKEN!)

export async function FetchData(): Promise<string> {
  const browser = await launch()
  const page = await browser.newPage()
  page.goto('https://www.legulegu.com/stockdata/a-ttm-lyr').catch((e) => {
    if (e instanceof Error) {
      console.log(`${e.name}: ${e.message}`)
    } else {
      console.log(e)
    }
  })
  await page.waitForSelector(selector)
  const target = await page.$eval(selector, (element) => {
    return element.textContent ?? ''
  })
  await page.close()
  await browser.close()
  return target
}

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
