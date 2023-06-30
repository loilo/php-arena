import EncodingWorker from '../util/encoding-worker/encoding-worker?worker&inline'

export const useEncodingWorkerStore = defineStore('encoding-worker', () => {
  // const worker = new Worker(
  //   new URL('../util/encoding-worker/encoding-worker', import.meta.url),
  //   {
  //     type: 'module',
  //   },
  // )
  const worker = new EncodingWorker()

  return { get: () => worker }
})
