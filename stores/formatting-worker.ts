export const useFormattingWorkerStore = defineStore('formatting-worker', () => {
  const worker = new Worker(
    new URL('../util/formatting-worker/formatting-worker', import.meta.url),
    {
      type: 'module',
    },
  )

  return { get: () => worker }
})
