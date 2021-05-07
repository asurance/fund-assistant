import { createElement } from 'react'
import App from './email'
import { SendEmail, dingdingRobot, GetTTMData, GetTTMLevel } from './utils/util'

async function Main() {
  const ttmPromise = GetTTMData()
  const emailPromise = ttmPromise.then((ttm) =>
    SendEmail('基金日报', createElement(App, { data: ttm })),
  )
  const dingDingPromise = ttmPromise.then((ttm) => {
    if (ttm.length >= 2) {
      const pre = ttm[ttm.length - 2]
      const now = ttm[ttm.length - 1]
      const preLevel = GetTTMLevel(pre.averagePETTM)
      const nowLevel = GetTTMLevel(now.averagePETTM)
      if (nowLevel !== preLevel) {
        return dingdingRobot.sendLink(
          '小助手: 动态市盈率',
          `ttm level变动${nowLevel - preLevel}`,
          'https://mail.qq.com/',
        )
      }
    }
  })
  await Promise.all([emailPromise, dingDingPromise])
}

Main()
