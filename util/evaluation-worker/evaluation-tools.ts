import type { WebPHP, SupportedPHPVersion } from '@php-wasm/web'
import { EvaluationResult } from './evaluation-utils'
import { setupComposer } from './composer-setup'

let webPhpModulePromise: Promise<typeof WebPHP> | undefined
function getWasmModule() {
  if (!webPhpModulePromise) {
    // Vite does not work properly with dynamic imports in workers, so we need to eval the import
    webPhpModulePromise = eval('import("/php-wasm/index.js")').then(
      (module: any) => module.WebPHP,
    )
  }
  return webPhpModulePromise!
}

export function getPhpEngine(version: SupportedPHPVersion): Promise<WebPHP> {
  return getWasmModule().then(WebPHP =>
    WebPHP.load(version, {
      requestHandler: {
        documentRoot: '/arena',
      },
    }),
  )
}

const enginePromises = new Map<string, Promise<WebPHP>>()
export function getCachedPhpEngine(
  version: SupportedPHPVersion,
): Promise<WebPHP> {
  let enginePromise: Promise<WebPHP>

  if (enginePromises.has(version)) {
    enginePromise = enginePromises.get(version)!
  } else {
    enginePromise = getPhpEngine(version)
    enginePromises.set(version, enginePromise)
  }

  return enginePromise
}

export async function evaluate(
  php: WebPHP,
  code: string,
): Promise<EvaluationResult> {
  if (php.fileExists('/arena')) {
    php.rmdir('/arena', { recursive: true })
  }
  php.mkdir('/arena')
  setupComposer(php)
  php.writeFile(
    '/arena/index.php',
    `<?php require_once __DIR__ . '/vendor/autoload.php' ?>${code}`,
  )
  let response = await php.run({ scriptPath: '/arena/index.php' })

  console.log('response', response)

  return response.text
}
