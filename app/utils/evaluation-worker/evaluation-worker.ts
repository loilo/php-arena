// Handle the actual conversion
import {
  evaluate,
  getCachedPhpEngine,
  getCachedComposerSetupFunction,
} from './evaluation-tools'
import { validateMessage } from './evaluation-utils'
import type { EvaluationWorkerResponse } from './evaluation-utils'

addEventListener('message', async event => {
  const data = event.data
  validateMessage(data)

  const [engine, setupFunction] = await Promise.all([
    getCachedPhpEngine(data.baseUrl, data.version),
    getCachedComposerSetupFunction(data.version),
  ] as const)

  let result: string
  try {
    result = await evaluate(engine, data.code, setupFunction)
  } catch (error) {
    const failure =
      typeof error === 'object' && error !== null
        ? (error as {
            message?: unknown
            response?: { errors?: unknown }
          })
        : undefined
    const stderr = failure?.response?.errors
    const message = String(failure?.message ?? error)
    const errorIdentifier = 'the following output: '
    const stderrIdentifier = '=== Stderr ==='
    result =
      typeof stderr === 'string' && stderr.trim()
        ? stderr.trim()
        : message.includes(errorIdentifier)
          ? message.slice(message.indexOf(errorIdentifier) + errorIdentifier.length)
          : message.includes(stderrIdentifier)
            ? message.slice(message.indexOf(stderrIdentifier) + stderrIdentifier.length)
            : message
    result = result.replaceAll('/arena/index.php', 'PHP Arena code')
  }

  postMessage({
    type: 'evaluated',
    payload: result,
    id: data.id,
  } satisfies EvaluationWorkerResponse)
})
