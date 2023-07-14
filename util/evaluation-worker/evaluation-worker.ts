// Handle the actual conversion
import {
  evaluate,
  getCachedPhpEngine,
  getCachedComposerSetupFunction,
} from './evaluation-tools'
import { EvaluationWorkerResponse, validateMessage } from './evaluation-utils'

addEventListener('message', async event => {
  const data = event.data
  validateMessage(data)

  const [engine, setupFunction] = await Promise.all([
    getCachedPhpEngine(data.baseUrl, data.version),
    getCachedComposerSetupFunction(data.version),
  ] as const)
  const result = await evaluate(engine, data.code, setupFunction)

  postMessage({
    type: 'evaluated',
    payload: result,
    id: data.id,
  } satisfies EvaluationWorkerResponse)
})
