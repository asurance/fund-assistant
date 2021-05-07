import axios from 'axios'

export function useDingDingRobot(
  token: string,
): {
  sendText: (
    text: string,
    at?: { atMobiles?: string[]; atUserIds?: string[]; isAtAll?: boolean },
  ) => Promise<void>
  sendMarkdown: (
    title: string,
    text: string,
    at?: { atMobiles?: string[]; atUserIds?: string[]; isAtAll?: boolean },
  ) => Promise<void>
  sendLink: (
    title: string,
    text: string,
    messageUrl: string,
    picUrl?: string,
  ) => Promise<void>
} {
  return {
    sendText: (
      text: string,
      at?: { atMobiles?: string[]; atUserIds?: string[]; isAtAll?: boolean },
    ) =>
      axios.post(`https://oapi.dingtalk.com/robot/send?access_token=${token}`, {
        msgtype: 'text',
        text: {
          content: text,
        },
        at,
      }),
    sendMarkdown: (
      title: string,
      text: string,
      at?: { atMobiles?: string[]; atUserIds?: string[]; isAtAll?: boolean },
    ) =>
      axios.post(`https://oapi.dingtalk.com/robot/send?access_token=${token}`, {
        msgtype: 'markdown',
        markdown: {
          title,
          text,
          at,
        },
      }),
    sendLink: (
      title: string,
      text: string,
      messageUrl: string,
      picUrl?: string,
    ) =>
      axios.post(`https://oapi.dingtalk.com/robot/send?access_token=${token}`, {
        msgtype: 'link',
        link: {
          title,
          text,
          messageUrl,
          picUrl,
        },
      }),
  }
}
