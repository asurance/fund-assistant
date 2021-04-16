import { createElement } from 'react'
import App from '../email'
import { TTMType } from '../interfaces/ttm'
import { FetchData, GetData, SaveData } from './data'
import { GetMailContent, SendEmail } from './emailUtil'

async function Main() {
  const [data, pre] = await Promise.all([FetchData(), GetData()])
  console.log(`抓取到:${data}`)
  if (pre === null) {
    console.log('没有获取到缓存数据')
  } else {
    console.log(`获取到缓存数据 ttf: ${pre}`)
  }
  const ttm = parseFloat(data.split(':')[1])
  const lastTtm = pre ?? ttm
  if (isNaN(ttm)) {
    await SendEmail('基金日报', `获取ttm失败,实际获取内容:${data}`)
  } else {
    await SaveData(ttm)
    if (ttm > 50 && lastTtm <= 50) {
      await SendEmail(
        '基金日报',
        GetMailContent(createElement(App, { ttm, type: TTMType.high })),
      )
    } else if (ttm <= 40 && lastTtm > 40) {
      await SendEmail(
        '基金日报',
        GetMailContent(createElement(App, { ttm, type: TTMType.low })),
      )
    }
  }
}

Main()
