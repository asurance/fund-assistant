import moment from 'moment'
import { FundInfoMap } from '../config'
import { Request } from './uses'

export async function GetFundPrice(): Promise<Map<string, number[]>> {
  const out = new Map<string, number[]>()
  const promiseList: Promise<void>[] = []
  for (const [name, { code }] of FundInfoMap) {
    promiseList.push(
      GetSinglePrice(code)
        .then((price) => {
          out.set(name, price)
        })
        .catch((err) => {
          out.set(name, [])
          console.error(err)
        }),
    )
  }
  await Promise.all(promiseList)
  return out
}

const timestamp = moment().format('YYYYMMDDHHmmss')

async function GetSinglePrice(code: string): Promise<number[]> {
  const [historical, predict] = await Promise.all([
    GetNetWorthTrend(code),
    GetPredict(code),
  ])
  if (predict === null || historical.length === 0) {
    return []
  } else {
    historical.push(predict)
    return historical.reverse()
  }
}

async function GetNetWorthTrend(code: string): Promise<number[]> {
  const jsScript = await Request<string>(
    `http://fund.eastmoney.com/pingzhongdata/${code}.js?v=${timestamp}`,
  )
  const netWorthTrend = eval(`${jsScript};Data_netWorthTrend`) as {
    equityReturn: number
  }[]
  return (netWorthTrend ?? []).map((trend) => trend.equityReturn)
}

async function GetPredict(code: string): Promise<number | null> {
  const jsScript = await Request<string>(
    `http://fundgz.1234567.com.cn/js/${code}.js?rt=${moment.now()}`,
  )
  return await new Promise<number | null>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const jsonpgz = (data: { gszzl: string }) => {
      const value = parseFloat(data.gszzl)
      resolve(isNaN(value) ? null : value)
    }
    eval(jsScript)
    resolve(null)
  })
}
