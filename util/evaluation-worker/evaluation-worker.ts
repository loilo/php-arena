// Handle the actual conversion
import { evaluate, getCachedPhpEngine } from './evaluation-tools'
import { EvaluationWorkerResponse, validateMessage } from './evaluation-utils'

addEventListener('message', async event => {
  const data = event.data
  validateMessage(data)

  const engine = await getCachedPhpEngine(data.baseUrl, data.version)
  const result = await evaluate(engine, data.code)

  postMessage({
    type: 'evaluated',
    payload: result,
    id: data.id,
  } satisfies EvaluationWorkerResponse)
})
