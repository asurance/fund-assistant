// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Empty = (): void => {}

export function ClampTo01(value: number): number {
  return Math.max(0, Math.min(1, value))
}

export function ParseError(error: unknown): string {
  if (typeof error === 'string') {
    return error
  } else if (error instanceof Error) {
    return error.message
  } else if (error instanceof Object && 'message' in error) {
    return error['message']
  } else {
    return 'unknown error'
  }
}

export function Wait(time: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, time))
}
