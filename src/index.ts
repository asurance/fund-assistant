import { createElement } from 'react'
import { FundInfoMap } from './config'
import App from './email'
import { FundData } from './interfaces/fund'
import { GetFundPrice } from './utils/fund'
import { dingdingRobot, SendEmail } from './utils/uses'

async function Main() {
  const fundPromise = GetFundPrice()
    .then((data) => {
      const out = new Map<string, FundData | null>()
      for (const [name, values] of data) {
        if (values.length === 0) {
          out.set(name, null)
          continue
        }
        let acc = values[0]
        for (let i = 1; i < values.length; i++) {
          const value = values[i]
          if (acc * value >= 0) {
            acc += value
          } else {
            if (Math.abs(acc) * 0.1 >= Math.abs(value)) {
              acc += value
            } else {
              break
            }
          }
        }
        out.set(name, {
          cur: values[0],
          acc,
        })
      }
      return out
    })
    .catch(() => new Map<string, FundData>())
  const emailPromise = fundPromise.then((funds) =>
    SendEmail('基金日报', createElement(App, { funds })),
  )
  const dingDingPromise = fundPromise.then((funds) => {
    const logs: string[] = []
    for (const [name, data] of funds) {
      const code = FundInfoMap.get(name)?.code ?? 'unknown'
      if (data === null) {
        logs.push(`* ${name}(${code}) 获取数据失败`)
      } else {
        const { acc } = data
        if (acc >= 4) {
          logs.push(`* ${name}(${code}) 估值上升累计已达${acc.toFixed(2)}%`)
        } else if (acc <= -4) {
          logs.push(`* ${name}(${code}) 估值下降累计已达${acc.toFixed(2)}%`)
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
