import type { SupportedPHPVersion } from '@php-wasm/web'

export const usePhpVersionStore = defineStore('php-version', () => {
  const phpVersion = useCycleList<SupportedPHPVersion>(
    ['7.0', '7.1', '7.2', '7.3', '7.4', '8.0', '8.1', '8.2', '8.3'],
    {
      initialValue: '8.3',
    },
  )

  return phpVersion
})
