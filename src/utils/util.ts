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
