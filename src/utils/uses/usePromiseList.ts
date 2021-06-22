export function usePromiseQueue(
  count: number,
): {
  push<T>(promsie: () => Promise<T>): Promise<T>
} {
  const queue: {
    promise: () => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
    resolve: (result: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
    reject: (reason: any) => void // eslint-disable-line @typescript-eslint/no-explicit-any
  }[] = []
  const onFinish = async () => {
    if (count <= 0 && queue.length > 0) {
      const next = queue.shift()!
      try {
        const result = await next.promise()
        next.resolve(result)
      } catch (err) {
        next.reject(err)
      } finally {
        onFinish()
      }
    } else {
      count++
    }
  }
  return {
    async push<T>(promise: () => Promise<T>) {
      if (count > 0) {
        count--
        try {
          const result = await promise()
          return result
        } finally {
          onFinish()
        }
      } else {
        return new Promise<T>((resolve, reject) => {
          queue.push({
            promise,
            resolve,
            reject,
          })
        })
      }
    },
  }
}
