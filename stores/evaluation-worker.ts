export const useEvaluationWorkerStore = defineStore('evaluation-worker', () => {
  const worker = new Worker(
    new URL('../util/evaluation-worker/evaluation-worker', import.meta.url),
    {
      type: 'module',
    },
  )

  return { get: () => worker }
})
