import type { SupportedPHPVersion } from '@php-wasm/universal'

export const usePhpVersionStore = defineStore('php-version', () => {
  const phpVersion = useCycleList<SupportedPHPVersion>(
    ['7.4', '8.0', '8.1', '8.2', '8.3', '8.4', '8.5'],
    {
      initialValue: '8.3',
    },
  )

  return phpVersion
})
