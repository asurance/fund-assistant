import { writeFile, readFile } from 'fs'

export function useCache<T>(
  path: string,
): {
  getCache: () => Promise<T | null>
  setCache: (data: T) => Promise<void>
} {
  return {
    getCache: () => {
      return new Promise<T | null>((resolve, reject) => {
        readFile(path, 'utf-8', (err, data) => {
          if (err) {
            if (err.code === 'ENOENT') {
              resolve(null)
            } else {
              reject(err)
            }
          } else {
            resolve(JSON.parse(data))
          }
        })
      })
    },
    setCache: (data) => {
      return new Promise<void>((resolve, reject) => {
        writeFile(path, JSON.stringify(data), 'utf-8', (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    },
  }
}
