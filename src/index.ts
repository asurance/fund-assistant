import { createElement } from 'react'
import App from './email'
import { GetTTMData } from './utils/ttm'
import { dingdingRobot, SendEmail } from './utils/uses'
import { FetchData } from './utils/util'

async function Main() {
  const fundPromise = FetchData()
  const ttmPromise = GetTTMData()
  const emailPromise = Promise.all([
    ttmPromise,
    fundPromise,
  ]).then(([ttm, funds]) =>
    SendEmail('基金日报', createElement(App, { ttm, funds })),
  )
  const dingDingPromise = fundPromise.then((funds) => {
    const logs: string[] = []
    for (const fundName in funds) {
      const fund = funds[fundName]
      let sum = 0
      for (const f of fund) {
        if (isNaN(f)) {
          logs.push(`* ${fundName} 数据异常,当前累计:${sum}`)
          break
        }
        if (sum * f < 0) {
          break
        }
        sum += f
        if (sum <= -4) {
          logs.push(`* ${fundName} 估值下降累计已超过4%`)
          break
        } else if (sum >= 4) {
          logs.push(`* ${fundName} 估值上升累计已超过4%`)
          break
        }
      }
    }
    if (logs.length > 0) {
      return dingdingRobot.sendMarkdown('小助手', logs.join('\n'))
    }
  })
  await Promise.all([emailPromise, dingDingPromise])
}

Main()
