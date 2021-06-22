import { FundInfo } from './interfaces/fund'

export const fundCodes = ['003096', '161005']

export const IndustryCodeMap = new Map<string, string>([
  ['农、林、牧、渔业', 'A'],
  ['采矿业', 'B'],
  ['制造业', 'C'],
  ['电力、热力、燃气及水的生产和供应业', 'D'],
  ['建筑业', 'E'],
  ['批发和零售业', 'F'],
  ['交通运输、仓储和邮政业', 'G'],
  ['住宿和餐饮业', 'H'],
  ['信息传输、软件和信息技术服务业', 'I'],
  ['金融业', 'J'],
  ['房地产业', 'K'],
  ['租赁和商务服务业', 'L'],
  ['科学研究和技术服务业', 'M'],
  ['水利、环境和公共设施管理业', 'N'],
  ['居民服务、修理和其他服务业', 'O'],
  ['教育', 'P'],
  ['卫生和社会工作业', 'Q'],
  ['文化、体育和娱乐业', 'R'],
  ['综合', 'S'],
])

export const FundInfoMap = new Map<string, FundInfo>([
  [
    '股票1',
    {
      code: '003096',
      industry: ['行业一'],
    },
  ],
])
