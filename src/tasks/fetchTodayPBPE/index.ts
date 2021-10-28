import fetch from 'node-fetch'
import moment from 'moment'
import { load } from 'cheerio'
import { MongoClient } from 'mongodb'
import { dingdingRobot } from '../../utils/uses/useDingDingRobot'

async function main() {
  const errors: string[] = []
  try {
    const PEResult = await fetchPE()
    console.log('获取到PE数据', PEResult)
    if (isNaN(PEResult.avgPE)) {
      errors.push('PE平均值获取失败')
    }
    if (isNaN(PEResult.midPE)) {
      errors.push('PE中位数获取失败')
    }
    const PBResult = await fetchPB()
    console.log('获取到PB数据', PBResult)
    if (isNaN(PBResult.avgPB)) {
      errors.push('PB平均值获取失败')
    }
    if (isNaN(PBResult.midPB)) {
      errors.push('PB中位数获取失败')
    }
    if (PEResult.date !== PBResult.date) {
      errors.push('PB,PE时间未对应')
    }
    if (errors.length === 0) {
      const client = await MongoClient.connect(process.env.MONGODB_URL!)
      console.log('连接上数据库')
      const collection = client.db('share').collection('overview')
      const count = await collection.find({ date: PEResult.date }).count()
      if (count === 0) {
        console.log('当天数据不存在')
        await collection.insertOne({
          date: PEResult.date,
          midPE: PEResult.midPE,
          midPB: PBResult.midPB,
          avgPE: PEResult.avgPE,
          avgPB: PBResult.avgPB,
        })
      } else {
        console.log('当天数据已存在')
      }
      await client.close()
    }
  } catch (e) {
    errors.push(e as string)
  }
  if (errors.length > 0) {
    dingdingRobot.sendText(`获取PB/PE数据时出现错误\n${errors.join('\n')}`)
  }
}

async function fetchPE() {
  const peRe = /:(.*)/
  const midSelector = '.market-info > div > div:nth-child(2) > div:nth-child(1)'
  const avgSelector = '.market-info > div > div:nth-child(2) > div:nth-child(2)'
  const timeSelector = '.market-info > div > div:nth-child(3)'
  const response = await fetch(`https://www.legulegu.com/stockdata/a-ttm-lyr`)
  const html = await response.text()
  const $ = load(html)
  return {
    midPE: parseFloat(peRe.exec($(midSelector).text())?.[1] ?? ''),
    avgPE: parseFloat(peRe.exec($(avgSelector).text())?.[1] ?? ''),
    date: moment($(timeSelector).text().trim(), 'YYYY年MM月DD日').valueOf(),
  }
}

async function fetchPB() {
  const pbRe = /:(.*)/
  const midSelector = '.market-info > div > div:nth-child(2) > div:nth-child(1)'
  const avgSelector = '.market-info > div > div:nth-child(2) > div:nth-child(2)'
  const timeSelector = '.market-info > div > div:nth-child(3)'
  const response = await fetch(`https://www.legulegu.com/stockdata/all-pb`)
  const html = await response.text()
  const $ = load(html)
  return {
    midPB: parseFloat(pbRe.exec($(midSelector).text())?.[1] ?? ''),
    avgPB: parseFloat(pbRe.exec($(avgSelector).text())?.[1] ?? ''),
    date: moment($(timeSelector).text().trim(), 'YYYY年MM月DD日').valueOf(),
  }
}

main()
