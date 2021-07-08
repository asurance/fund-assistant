import { hex } from 'js-md5'
import { FundInfoMap, IndustryCodeMap } from '../config'
import { ATTMData, IndustryTTMData } from '../interfaces/ttm'
import { Request } from './uses'

function GetToken(): string {
  const date = new Date()
  return hex(
    [
      date.getFullYear(),
      `00${date.getMonth() + 1}`.slice(-2),
      `00${date.getDate()}`.slice(-2),
    ].join('-'),
  )
}

const token = GetToken()

async function GetATTMData(): Promise<number[]> {
  const data = await Request<ATTMData[]>(
    `https://www.legulegu.com/api/stockdata/market-ttm-lyr/get-data?token=${token}&marketId=5`,
  )
  return data.map((ttm) => ttm.middlePETTM)
}

async function GetIndustryTTMData(industryCode: string): Promise<number[]> {
  const data = await Request<IndustryTTMData[]>(
    `https://www.legulegu.com/api/stockdata/industry/zjh/${industryCode}/data?token=${token}`,
  )
  return data.map((ttm) => ttm.ttmPE)
}

export async function GetTTMData(): Promise<Map<string, number[]>> {
  const out = new Map<string, number[]>()
  const promiseList: Promise<void>[] = []
  promiseList.push(
    GetATTMData()
      .then((ttm) => {
        out.set('A股', ttm)
      })
      .catch(console.error),
  )
  const industrySet = new Set<string>()
  for (const { industry } of FundInfoMap.values()) {
    for (const i of industry) {
      industrySet.add(i)
    }
  }
  for (const [industry, code] of IndustryCodeMap) {
    if (industrySet.has(industry)) {
      promiseList.push(
        GetIndustryTTMData(code)
          .then((ttm) => {
            out.set(industry, ttm)
          })
          .catch(console.error),
      )
    }
  }
  await Promise.all(promiseList)
  return out
}
