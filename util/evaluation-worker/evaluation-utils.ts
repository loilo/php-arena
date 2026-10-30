import {
  SupportedPHPVersions,
  type SupportedPHPVersion,
} from '@php-wasm/universal'

export type WorkerMessage = {
  id: string
  type: 'evaluate'
  code: string
  baseUrl: string
  version: SupportedPHPVersion
}

export type EvaluationResult = string

export type EvaluationWorkerResponse = {
  type: 'evaluated'
  payload: EvaluationResult
  id: string
}

export function ensureRecord(
  message: unknown,
): asserts message is Record<string, unknown> {
  if (typeof message !== 'object' || message === null) {
    throw new Error('Invalid message')
  }
}

export function validateMessage(
  message: unknown,
): asserts message is WorkerMessage {
  ensureRecord(message)

  if (typeof message.id !== 'string') {
    throw new Error('Invalid message id')
  }

  if (message.type !== 'evaluate') {
    throw new Error('Invalid message type')
  }

  if (typeof message.code !== 'string') {
    throw new Error('Invalid message payload: code')
  }

  if (typeof message.baseUrl !== 'string') {
    throw new Error('Invalid message payload: baseUrl')
  }

  if (!SupportedPHPVersions.includes(message.version as SupportedPHPVersion)) {
    throw new Error('Invalid PHP version')
  }
}
