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

  let result: string
  try {
    result = await evaluate(engine, data.code, setupFunction)
  } catch (error) {
    const message = String((error as any).message ?? error)
    const errorIdentifier = 'the following output: '
    if (message.includes(errorIdentifier)) {
      result = message
        .slice(message.indexOf(errorIdentifier) + errorIdentifier.length)
        .replaceAll('/arena/index.php', 'PHP Arena code')
    } else {
      result = message
    }
  }

  postMessage({
    type: 'evaluated',
    payload: result,
    id: data.id,
  } satisfies EvaluationWorkerResponse)
})
