import { writeFile } from 'fs'
import { resolve } from 'path'
import { launch } from 'puppeteer'

const selector = 'body > div.lg-main > div.container.lg-container.lg-container-ad > div > div.col-md-12 > div.stock-data-center > div.data-view > div.market > div > div > div.col-md-4.market-title-data-for-index > div:nth-child(2)'

const jsonPath = resolve(__dirname, '../data.json')

export async function FetchData(): Promise<string> {
    const browser = await launch()
    const page = await browser.newPage()
    await page.goto('https://www.legulegu.com/stockdata/a-ttm-lyr', {
        waitUntil: 'domcontentloaded'
    })
    const target = await page.$eval(selector, (element) => {
        return element.textContent ?? ''
    })
    await page.close()
    await browser.close()
    return target
}

export function SaveData(ttm: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        writeFile(jsonPath, JSON.stringify({ ttm }), (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}