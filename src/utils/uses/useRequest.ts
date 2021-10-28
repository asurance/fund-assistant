import axios from 'axios'
import { usePromiseQueue } from './usePromiseList'

const httpQueue = usePromiseQueue(5)

export function useRequest<T>(url: string): Promise<T> {
  return httpQueue.push(() => {
    return new Promise<T>((resolve, reject) => {
      axios(url)
        .then((data) => resolve(data.data))
        .catch(reject)
    })
  })
}
