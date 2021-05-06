import { createElement } from 'react'
import App from './email'
import { TTMType } from './interfaces/ttm'
import { FetchData, cache, SendEmail, dingdingRobot } from './utils/util'

async function Main() {
  const ttmPromise = FetchData().then((data) => {
    console.log(`获取到数据: ${data}`)
    const ttm = parseFloat(data.split(':')[1])
    return isNaN(ttm) ? null : ttm
  })
  const cachePromise = cache.getCache().then((data) => {
    if (data === null) {
      console.log('没有获取到缓存数据')
    } else {
      console.log(`获取到缓存数据: ${data.ttm}`)
    }
    return data
  })
  const emailPromise = Promise.all([ttmPromise, cachePromise]).then(
    ([ttm, cacheData]) => {
      if (ttm === null) return
      if (cacheData === null) {
        if (ttm > 50) {
          return SendEmail(
            '基金日报',
            createElement(App, { ttm, type: TTMType.high }),
          )
        } else if (ttm <= 40) {
          return SendEmail(
            '基金日报',
            createElement(App, { ttm, type: TTMType.low }),
          )
        }
      } else {
        if (ttm > 50 && cacheData.ttm <= 50) {
          return SendEmail(
            '基金日报',
            createElement(App, { ttm, type: TTMType.high }),
          )
        } else if (ttm <= 40 && cacheData.ttm > 40) {
          return SendEmail(
            '基金日报',
            createElement(App, { ttm, type: TTMType.low }),
          )
        }
      }
    },
  )
  const dingDingPromise = ttmPromise.then((ttm) => {
    return dingdingRobot.sendText(`小助手: 获取ttm${ttm}`)
  })
  const saveDataPromise = ttmPromise.then((ttm) => {
    if (ttm === null) return Promise.resolve()
    return cache.setCache({ ttm })
  })
  await Promise.all([emailPromise, dingDingPromise, saveDataPromise])
}

Main()
