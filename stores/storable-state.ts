import type { SupportedPHPVersion } from '@php-wasm/web'

export type State = {
  code: string
  autoRun: boolean
  phpVersion: SupportedPHPVersion
  outputMode: 'raw' | 'pretty'
}

export const useStorableStateStore = defineStore('storableState', () => {
  const inputCodeStore = useInputCodeStore()
  const phpVersionStore = usePhpVersionStore()
  const autoRunStore = useAutoRunStore()
  const outputModeStore = useOutputModeStore()

  const storableState = computed<State>(() => {
    return {
      code: inputCodeStore.state,
      autoRun: autoRunStore.state,
      phpVersion: phpVersionStore.state,
      outputMode: outputModeStore.state,
    }
  })
  const throttledStorableState = refThrottled(storableState, 1000)

  // Manage reading from/writing to session storage
  const sessionDocument = useSessionStorage<State | null>('document', null, {
    serializer: {
      read: (v: any) => {
        try {
          return JSON.parse(v)
        } catch {
          return null
        }
      },
      write: (v: any) => JSON.stringify(v),
    },
  })

  // Write changes to session storage
  watch(throttledStorableState, value => {
    if (typeof window.requestIdleCallback === 'function') {
      requestIdleCallback(
        () => {
          sessionDocument.value = value
        },
        { timeout: 400 },
      )
    } else {
      sessionDocument.value = value
    }
  })

  const urlState = useUrlState()
  onMounted(() => {
    urlState.read().then(value => {
      if (value == null) {
        if (sessionDocument.value === null) return
        value = toRaw(sessionDocument.value)
      }

      if (typeof value.code === 'string') {
        inputCodeStore.state = value.code
      }

      if (typeof value.autoRun === 'boolean') {
        autoRunStore.state = value.autoRun
      }

      if (typeof value.phpVersion === 'string') {
        phpVersionStore.state = value.phpVersion
      }

      if (typeof value.outputMode === 'string') {
        outputModeStore.state = value.outputMode
      }

      const url = new URL(window.location.href)
      url.hash = ''
      history.replaceState(history.state, '', url.href)
    })
  })

  return {
    encode() {
      return urlState.encode(storableState.value)
    },
  }
})
