export const useColorThemeStore = defineStore('color-theme', () => {
  const colorMode = useColorMode()
  const cycle = useCycleList<'light' | 'system' | 'dark'>(
    ['light', 'system', 'dark'],
    {
      initialValue: colorMode.preference as 'light' | 'system' | 'dark',
    },
  )

  function toggle() {
    cycle.next()
    colorMode.preference = cycle.state.value
  }

  const theme = computed(() => {
    if (colorMode.preference === 'system') {
      return colorMode.value === 'dark' ? 'dark' : 'light'
    } else {
      return colorMode.preference === 'dark' ? 'dark' : 'light'
    }
  })

  return {
    auto: computed(() => colorMode.preference === 'system'),
    theme,
    toggle,
  }
})
