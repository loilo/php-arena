// Handle conversion in a worker

import type { SupportedPHPVersion } from '@php-wasm/web'
import type {
  WorkerMessage,
  EvaluationWorkerResponse,
  EvaluationResult,
} from 'util/evaluation-worker/evaluation-utils'

import type { ToRefs } from 'vue'

export function useEvaluator(
  input: Ref<string>,
  version: MaybeRef<SupportedPHPVersion>,
): Ref<EvaluationResult> {
  if (import.meta.env.SSR) {
    return computed(() => '')
  }

  const worker = useEvaluationWorkerStore().get()

  function evaluate(code: string, version: SupportedPHPVersion) {
    return new Promise<EvaluationResult>(resolve => {
      const id = crypto.randomUUID()

      const stop = useEventListener(
        worker,
        'message',
        (event: MessageEvent<EvaluationWorkerResponse>) => {
          if (event.data?.id !== id) return

          stop()
          resolve(event.data.payload)
        },
      )

      worker.postMessage({
        type: 'evaluate',
        id,
        code,
        version,
      } satisfies WorkerMessage)
    })
  }

  const result = asyncComputed(
    () => evaluate(input.value, toValue(version)),
    '',
  )

  return computed(() => result.value)
}
