import { FundInfoMap } from '../config'
import { Search, useBrowser } from './uses'

export async function GetFundPrice(): Promise<Map<string, number[]>> {
  return await useBrowser(async (browser) => {
    const out = new Map<string, number[]>()
    const promiseList: Promise<void>[] = []
    for (const [name, { code }] of FundInfoMap) {
      promiseList.push(
        Search(browser, code)
          .then((price) => {
            out.set(name, price)
          })
          .catch(console.error),
      )
    }
    await Promise.all(promiseList)
    return out
  })
}
