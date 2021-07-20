import { ParseError, Wait } from '../util'

export async function useRetryPromise<T>(
  fn: () => Promise<T>,
  retryCount: number,
  retryDelay = 0,
): Promise<T> {
  const errorMessages: string[] = []
  while (retryCount > 0) {
    try {
      const result = await fn()
      return result
    } catch (e) {
      retryCount--
      errorMessages.push(ParseError(e))
      if (retryDelay > 0) {
        await Wait(retryDelay)
      }
    }
  }
  throw new Error(errorMessages.join('\n'))
}
