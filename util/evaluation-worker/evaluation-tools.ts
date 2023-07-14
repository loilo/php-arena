import type { WebPHP, SupportedPHPVersion } from '@php-wasm/web'
import { EvaluationResult } from './evaluation-utils'
import * as setup56 from './composer-setup-5.6'
import * as setup81 from './composer-setup-8.1'

let webPhpModulePromise: Promise<typeof WebPHP> | undefined
function getWasmModule(baseUrl: string) {
  if (!webPhpModulePromise) {
    // Vite does not work properly with dynamic imports in workers, so we need to eval the import
    webPhpModulePromise = eval(`import("${baseUrl}php-wasm/index.js")`).then(
      (module: any) => module.WebPHP,
    )
  }
  return webPhpModulePromise!
}

export function getPhpEngine(
  baseUrl: string,
  version: SupportedPHPVersion,
): Promise<WebPHP> {
  return getWasmModule(baseUrl).then(WebPHP =>
    WebPHP.load(version, {
      requestHandler: {
        documentRoot: '/arena',
      },
    }),
  )
}

const enginePromises = new Map<string, Promise<WebPHP>>()
export function getCachedPhpEngine(
  baseUrl: string,
  version: SupportedPHPVersion,
): Promise<WebPHP> {
  let enginePromise: Promise<WebPHP>

  if (enginePromises.has(version)) {
    enginePromise = enginePromises.get(version)!
  } else {
    enginePromise = getPhpEngine(baseUrl, version)
    enginePromises.set(version, enginePromise)
  }

  return enginePromise
}

export async function getComposerSetupFunction(
  version: SupportedPHPVersion,
): Promise<(engine: WebPHP) => void> {
  // TODO: Use dynamic imports as soon as Vite allows that in workers (vitejs/vite#10057)
  if (version.localeCompare('8.1') >= 0) {
    return setup81.setupComposer
  } else {
    return setup56.setupComposer
  }
}

const setupPromises = new Map<string, Promise<(engine: WebPHP) => void>>()
export function getCachedComposerSetupFunction(
  version: SupportedPHPVersion,
): Promise<(engine: WebPHP) => void> {
  let setupPromise: Promise<(engine: WebPHP) => void>

  if (setupPromises.has(version)) {
    setupPromise = setupPromises.get(version)!
  } else {
    setupPromise = getComposerSetupFunction(version)
    setupPromises.set(version, setupPromise)
  }

  return setupPromise
}

export async function evaluate(
  php: WebPHP,
  code: string,
  setupFunction?: (engine: WebPHP) => void,
): Promise<EvaluationResult> {
  if (php.fileExists('/arena')) {
    php.rmdir('/arena', { recursive: true })
  }
  php.mkdir('/arena')
  setupFunction?.(php)
  php.writeFile(
    '/arena/index.php',
    `<?php require_once __DIR__ . '/vendor/autoload.php' ?>${code}`,
  )
  let response = await php.run({ scriptPath: '/arena/index.php' })

  return response.text
}
