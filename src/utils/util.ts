// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Empty = (): void => {}

export function ClampTo01(value: number): number {
  return Math.max(0, Math.min(1, value))
}
