// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Empty = (): void => {}

export function Clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
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

export function TransformCumulate(cumulate: number[]): string {
  if (cumulate.length === 0) {
    return ''
  } else {
    let out = `${cumulate[0].toFixed(2)}`
    for (let i = 1; i < cumulate.length; i++) {
      out +=
        cumulate[i] >= 0
          ? `+${cumulate[i].toFixed(2)}`
          : `${cumulate[i].toFixed(2)}`
    }
    return out
  }
}
