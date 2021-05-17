import { createElement } from 'react'
import App from './email'
import {
  SendEmail,
  dingdingRobot,
  GetTTMData,
  GetTTMLevel,
  FetchData,
} from './utils/util'

async function Main() {
  const fundPromise = FetchData()
  const ttmPromise = GetTTMData()
  const emailPromise = Promise.all([
    ttmPromise,
    fundPromise,
  ]).then(([ttm, fund]) =>
    SendEmail('基金日报', createElement(App, { data: ttm, fund })),
  )
  const dingDingPromise = Promise.all([ttmPromise, fundPromise]).then(
    ([ttm, fund]) => {
      const logs: string[] = []
      if (ttm.length >= 2) {
        const pre = ttm[ttm.length - 2]
        const now = ttm[ttm.length - 1]
        const preLevel = GetTTMLevel(pre.averagePETTM)
        const nowLevel = GetTTMLevel(now.averagePETTM)
        if (nowLevel !== preLevel) {
          logs.push(`* ttm level 变动:${nowLevel - preLevel}`)
        }
      }
      {
        let sum = 0
        for (const f of fund) {
          if (isNaN(f)) {
            logs.push(`* 数据异常,当前累计:${sum}`)
            break
          }
          sum += f
          if (sum <= -4) {
            logs.push('* 估值下降累计已超过4%')
            break
          } else if (sum > 4) {
            logs.push('* 估值上升累计已超过4%')
          }
        }
      }
      if (logs.length > 0) {
        return dingdingRobot.sendMarkdown('小助手', logs.join('\n'))
      }
    },
  )
  await Promise.all([emailPromise, dingDingPromise])
}

Main()
