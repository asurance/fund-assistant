import axios from 'axios'

export function useDingDingRobot(
  token: string,
): {
  sendText: (text: string) => Promise<unknown>
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
        at: at,
      }),
  }
}
