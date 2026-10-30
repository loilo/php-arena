export const useFormattingWorkerStore = defineStore('formatting-worker', () => {
  const worker = new Worker(
    new URL('../utils/formatting-worker/formatting-worker', import.meta.url),
    {
      type: 'module',
    },
  )

  return { get: () => worker }
})
