/* eslint-disable react-hooks/rules-of-hooks */
import { SentMessageInfo } from 'nodemailer'
import { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { TTMData } from '../interfaces/ttm'
import { useDingDingRobot } from './uses/useDingDingRobot'
import { useEmail } from './uses/useEmail'
import { hex } from 'js-md5'
import axios from 'axios'
import { Browser, launch } from 'puppeteer'
import { fundCodes } from '../config'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Empty = (): void => {}

function GetToken(): string {
  const date = new Date()
  return hex(
    [
      date.getFullYear(),
      `00${date.getMonth() + 1}`.slice(-2),
      `00${date.getDate()}`.slice(-2),
    ].join('-'),
  )
}

export const token = GetToken()

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

export async function GetTTMData(): Promise<TTMData[]> {
  const data = await axios(
    `https://www.legulegu.com/api/stockdata/market-ttm-lyr/get-data?token=${token}&marketId=5`,
  )
  return data.data
}

const ttmLevel = [40, 50, 55, 60]

export function GetTTMLevel(ttm: number): number {
  let level = 0
  while (level < ttmLevel.length && ttm < ttmLevel[level]) {
    level++
  }
  return level
}

const historySelector = '#jztable > table > tbody > tr > td:nth-child(4)'
const predictSelector = '#fund_gszf'
const nameSelector =
  '#bodydiv > div:nth-child(13) > div.r_cont.right > div.basic-new > div.bs_jz > div.col-left > h4 > a'

async function FetchSingleData(
  browser: Browser,
  fundCode: string,
): Promise<{ name: string; ratio: number[] }> {
  const page = await browser.newPage()
  page.goto(`http://fundf10.eastmoney.com/jjjz_${fundCode}.html`).catch(Empty)
  const namePromise = page.waitForSelector(nameSelector).then(() => {
    return page.$eval(nameSelector, (element) => element.textContent!)
  })
  const historyPromise = page.waitForSelector(historySelector).then(() => {
    return page.$$eval(historySelector, (elements) =>
      elements.map((element) => parseFloat(element.textContent!)),
    )
  })
  const predictPromise = page.waitForSelector(predictSelector).then(() => {
    return page.$eval(predictSelector, (element) =>
      parseFloat(element.textContent!),
    )
  })
  const [name, history, predict] = await Promise.all([
    namePromise,
    historyPromise,
    predictPromise,
  ])
  return { name, ratio: [predict, ...history] }
}

export async function FetchData(): Promise<{ [name: string]: number[] }> {
  const browser = await launch()
  const out: { [name: string]: number[] } = {}
  const promisePool: Promise<void>[] = []
  for (const fundCode of fundCodes) {
    promisePool.push(
      FetchSingleData(browser, fundCode).then(({ name, ratio }) => {
        out[name] = ratio
      }),
    )
  }
  await Promise.all(promisePool)
  await browser.close()
  return out
}
