import fetch from 'node-fetch'
import moment from 'moment'
import { load } from 'cheerio'
import { MongoClient } from 'mongodb'
import { ParseError } from '../../utils/util'
import { dingdingRobot } from '../../utils/uses/useDingDingRobot'

async function main() {
  const logs: string[] = []
  let client: MongoClient | null = null
  try {
    const PBResult = await fetchPB()
    console.log('获取到PB数据', PBResult)
    if (isNaN(PBResult.avgPB) || isNaN(PBResult.midPB)) {
      throw new Error('数据不合法')
    }
    client = await MongoClient.connect(process.env.MONGODB_URL!)
    console.log('连接上数据库')
    const collection = client
      .db('share')
      .collection<{ date: number; midPB: number; avgPB: number }>('PB')
    const result = await collection.updateOne(
      { date: PBResult.date },
      { $set: { midPB: PBResult.midPB, avgPB: PBResult.avgPB } },
      { upsert: true },
    )
    if (result.matchedCount > 0) {
      console.log('存在数据,仅更新')
    } else {
      console.log('不存在数据,将新增')
    }
    await client.close()
  } catch (e) {
    await client?.close()
    logs.push(ParseError(e))
  }
  if (logs.length > 0) {
    dingdingRobot.sendMarkdown('小助手', `获取PB数据时出错\n${logs.join('\n')}`)
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
