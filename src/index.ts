import { createElement } from 'react'
import { FundInfoMap } from './config'
import App from './email'
import { FundData } from './interfaces/fund'
import { ParsedTTMData } from './interfaces/ttm'
import { GetFundPrice } from './utils/fund'
import { GetATTMData } from './utils/ttm'
import { dingdingRobot, SendEmail } from './utils/uses'
import { TransformCumulate } from './utils/util'

async function Main() {
  const attmPromise = GetATTMData()
    .then((ttm) => {
      if (ttm.length > 1) {
        const today = ttm[ttm.length - 1]
        const last = ttm[ttm.length - 2]
        ttm.sort((a, b) => a - b)
        const upRatio = ((today - last) / last) * 100
        const orderRatio = ((ttm.indexOf(today) + 1) / ttm.length) * 100
        const difRatio =
          ((today - ttm[0]) / (ttm[ttm.length - 1] - ttm[0])) * 100
        return {
          now: today,
          extra: {
            upRatio,
            orderRatio,
            difRatio,
          },
        } as ParsedTTMData
      } else if (ttm.length === 1) {
        return {
          now: ttm[0],
          extra: null,
        } as ParsedTTMData
      } else {
        return null
      }
    })
    .catch(() => null)
  const fundPromise = GetFundPrice()
    .then((data) => {
      const out = new Map<string, FundData | null>()
      for (const [name, values] of data) {
        if (values.length === 0) {
          out.set(name, null)
          continue
        }
        let acc = values[0]
        const cumulate = [values[0]]
        for (let i = 1; i < values.length; i++) {
          const value = values[i]
          if (acc * value >= 0) {
            acc += value
            cumulate.push(value)
          } else {
            if (Math.abs(acc) * 0.1 >= Math.abs(value)) {
              acc += value
              cumulate.push(value)
            } else {
              break
            }
          }
        }
        out.set(name, {
          cur: values[0],
          acc,
          cumulate,
        })
      }
      return [...out].sort(([, a], [, b]) => {
        if (a === null) {
          return 1
        } else if (b === null) {
          return -1
        } else {
          return b.acc - a.acc
        }
      })
    })
    .catch(() => [] as [string, FundData | null][])
  const emailPromise = Promise.all([attmPromise, fundPromise]).then(
    ([attm, funds]) =>
      SendEmail('基金日报', createElement(App, { attm, funds })),
  )
  const dingDingPromise = Promise.all([attmPromise, fundPromise]).then(
    ([attm, funds]) => {
      const logs: string[] = []
      if (attm && attm.extra) {
        const {
          now,
          extra: { orderRatio, difRatio },
        } = attm
        logs.push(
          `* A股:${now} 当前超越百分比:${orderRatio.toFixed(
            2,
          )} 极值百分比:${difRatio.toFixed(2)}`,
        )
      }
      for (const [name, data] of funds) {
        const code = FundInfoMap.get(name)?.code ?? 'unknown'
        if (data === null) {
          logs.push(`* ${name}(${code}) 获取数据失败`)
        } else {
          const { acc, cumulate } = data
          if (acc >= 4) {
            logs.push(
              `* ${name}(${code}) 估值上升累计已达${acc.toFixed(
                2,
              )}(${TransformCumulate(cumulate)})%`,
            )
          } else if (acc <= -4) {
            logs.push(
              `* ${name}(${code}) 估值下降累计已达${acc.toFixed(
                2,
              )}(${TransformCumulate(cumulate)})%`,
            )
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
