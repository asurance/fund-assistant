import { hex } from 'js-md5'
import { ATTMData } from '../interfaces/ttm'
import { useRequest } from './uses/useRequest'

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

export async function GetATTMData(): Promise<number[]> {
  const data = await useRequest<ATTMData[]>(
    `https://www.legulegu.com/api/stockdata/market-ttm-lyr/get-data?token=${token}&marketId=5`,
  )
  return data.map((ttm) => ttm.averagePETTM)
}
