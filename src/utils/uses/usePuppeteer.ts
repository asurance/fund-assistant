import { Browser, launch, Page } from 'puppeteer'

export async function useBrowser<Result>(
  cb: (browser: Browser) => Promise<Result>,
): Promise<Result> {
  const browser = await launch()
  const result = await cb(browser)
  await browser.close()
  return result
}

export async function usePage<Result>(
  browser: Browser,
  cb: (page: Page) => Promise<Result>,
): Promise<Result> {
  const page = await browser.newPage()
  const result = await cb(page)
  await page.close()
  return result
}
