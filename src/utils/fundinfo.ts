import { FundInfo } from '../interfaces/fund'
import { useDatabase } from './uses'

export async function GetFundInfo(): Promise<FundInfo[]> {
  return useDatabase('fundAssitant', async (db, session) => {
    return await db
      .collection<FundInfo>('funds')
      .find({}, { session })
      .toArray()
  }).catch((error) => {
    console.log(error)
    return []
  })
}
