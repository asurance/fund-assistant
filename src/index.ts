import { createElement } from 'react'
import App from '../email'
import { FetchData } from './data'
import { GetMailContent, SendEmail } from './emailUtil'

async function Main() {
    const data = await FetchData()
    console.log(`抓取到:${data}`)
    const ttm = parseFloat(data.split(':')[1])
    // await SaveData(ttm)
    if (isNaN(ttm)) {
        await SendEmail('基金日报', `获取ttm失败,实际获取内容:${data}`)
    } else {
        if (ttm > 50) {
            await SendEmail('基金日报', GetMailContent(createElement(App, { ttm })))
        } else if (ttm <= 40) {
            await SendEmail('基金日报', GetMailContent(createElement(App, { ttm })))
        }
    }
}

Main()
