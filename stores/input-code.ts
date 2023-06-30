export const useInputCodeStore = defineStore('input-code', () => {
  const inputCode = ref('<?php\n\n')

  return {
    state: inputCode,
  }
})
