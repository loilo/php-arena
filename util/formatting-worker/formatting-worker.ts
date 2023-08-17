// Handle the actual conversion
import { format } from './formatting-tools'
import { FormattingWorkerResponse, validateMessage } from './formatting-utils'

addEventListener('message', async event => {
  const data = event.data
  validateMessage(data)

  let success = true
  let result = ''
  try {
    result = await format(data.code, {
      phpVersion: data.version,
    })
  } catch {
    success = false
  }

  postMessage({
    type: 'formatted',
    payload: {
      success,
      result,
    },
    id: data.id,
  } satisfies FormattingWorkerResponse)
})
