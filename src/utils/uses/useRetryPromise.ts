import { ParseError } from '../util'

export async function useRetryPromise<T>(
  fn: () => Promise<T>,
  retryCount: number,
): Promise<T> {
  const errorMessages: string[] = []
  while (retryCount > 0) {
    try {
      const result = await fn()
      return result
    } catch (e) {
      retryCount--
      errorMessages.push(ParseError(e))
    }
  }
  throw new Error(errorMessages.join('\n'))
}