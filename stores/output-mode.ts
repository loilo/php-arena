export const useOutputModeStore = defineStore('output-mode', () => {
  const outputMode = useCycleList<'raw' | 'pretty'>(['raw', 'pretty'])

  return outputMode
})
