import { Browser, launch, Page } from 'puppeteer'

export async function useBrowser<Result>(
  cb: (browser: Browser) => Promise<Result>,
): Promise<Result> {
  const browser = await launch()
  try {
    const result = await cb(browser)
    await browser.close()
    return result
  } catch (e) {
    await browser.close()
    throw e
  }
}

export async function usePage<Result>(
  browser: Browser,
  cb: (page: Page) => Promise<Result>,
): Promise<Result> {
  const page = await browser.newPage()
  try {
    const result = await cb(page)
    await page.close()
    return result
  } catch (e) {
    await page.close()
    throw e
  }
}
