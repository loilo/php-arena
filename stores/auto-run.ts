export const useAutoRunStore = defineStore('auto-run', () => {
  const autoRun = ref(false)

  return {
    state: autoRun,
  }
})
