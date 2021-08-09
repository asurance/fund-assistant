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
    .then<ParsedTTMData | null>((ttm) => {
      if (ttm.length > 1) {
        console.log(`获取到${ttm.length}条ttm数据`)
        const today = ttm[ttm.length - 1]
        ttm.pop()
        ttm.sort((a, b) => a - b)
        let from = -Infinity
        let to = Infinity
        if (today < ttm[0]) {
          from = 0
          to = 0
        } else if (today > ttm[ttm.length - 1]) {
          from = 100
          to = 100
        } else {
          if (ttm.length === 1) {
            from = 0
            to = 100
          } else {
            let i = 0
            while (i < ttm.length) {
              if (today === ttm[i]) {
                from = (i / (ttm.length - 1)) * 100
                break
              } else if (today < ttm[i]) {
                from = to =
                  ((i - 1 + (today - ttm[i - 1]) / (ttm[i] - ttm[i - 1])) /
                    (ttm.length - 1)) *
                  100
                break
              }
              i++
            }
            if (to === Infinity) {
              to = from
              i++
              while (i < ttm.length) {
                if (today === ttm[i]) {
                  to = (i / (ttm.length - 1)) * 100
                } else {
                  break
                }
                i++
              }
            }
          }
        }
        if (from === -Infinity || to === Infinity) {
          return {
            now: today,
            orderRatio: null,
          }
        } else {
          return {
            now: today,
            orderRatio: {
              from,
              to,
            },
          }
        }
      } else if (ttm.length === 1) {
        console.log(`获取到1条ttm数据`)
        return {
          now: ttm[0],
          orderRatio: null,
        }
      } else {
        console.log('未获取到ttm数据')
        return null
      }
    })
    .catch(() => {
      console.log('获取ttm数据失败')
      return null
    })
  const fundPromise = GetFundPrice()
    .then((data) => {
      for (const [name, value] of data) {
        if (value.length === 0) {
          console.log(`未获取到${name}数据`)
        } else {
          console.log(`获取到${value.length}条${name}数据`)
        }
      }
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
    .catch(() => {
      console.log('获取基金数据失败')
      return [] as [string, FundData | null][]
    })
  const emailPromise = Promise.all([attmPromise, fundPromise]).then(
    ([attm, funds]) =>
      SendEmail('基金日报', createElement(App, { attm, funds })),
  )
  const dingDingPromise = Promise.all([attmPromise, fundPromise]).then(
    ([attm, funds]) => {
      const logs: string[] = []
      if (attm && attm.orderRatio) {
        const {
          now,
          orderRatio: { from, to },
        } = attm
        logs.push(`* A股ttm:${now}`)
        logs.push(
          `当前百分比:${
            from === to
              ? from.toFixed(2)
              : `${from.toFixed(2)} ~ ${to.toFixed(2)}`
          }%`,
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
