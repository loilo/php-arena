export const useShareStore = defineStore('share', () => {
  const show = ref(false)
  const url = ref('')

  return { show, url }
})
