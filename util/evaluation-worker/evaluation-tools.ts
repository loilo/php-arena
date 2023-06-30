import type { WebPHP, SupportedPHPVersion } from '@php-wasm/web'
import { EvaluationResult } from './evaluation-utils'
import { setupComposer } from './composer-setup'

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

  return response.text
}
