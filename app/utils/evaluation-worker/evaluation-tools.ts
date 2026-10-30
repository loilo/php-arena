import type { PHP, SupportedPHPVersion } from '@php-wasm/universal'
import type { EvaluationResult } from './evaluation-utils'
import * as setup74 from './composer-setup-7.4'
import * as setup81 from './composer-setup-8.1'
import * as setup84 from './composer-setup-8.4'

type WebPhpModule = {
  PHP: typeof import('@php-wasm/universal').PHP
  loadWebRuntime: typeof import('@php-wasm/web').loadWebRuntime
}

let webPhpModulePromise: Promise<WebPhpModule> | undefined
function getWasmModule(baseUrl: string) {
  if (!webPhpModulePromise) {
    // Vite does not work properly with dynamic imports in workers, so we need to eval the import
    webPhpModulePromise = eval(`import("${baseUrl}php-wasm/index.js")`)
  }
  return webPhpModulePromise!
}

export async function getPhpEngine(
  baseUrl: string,
  version: SupportedPHPVersion,
): Promise<PHP> {
  const { PHP, loadWebRuntime } = await getWasmModule(baseUrl)
  const runtimeId = await loadWebRuntime(version)

  return new PHP(runtimeId)
}

const enginePromises = new Map<string, Promise<PHP>>()
export function getCachedPhpEngine(
  baseUrl: string,
  version: SupportedPHPVersion,
): Promise<PHP> {
  let enginePromise: Promise<PHP>

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
): Promise<(engine: PHP) => void> {
  // TODO: Use dynamic imports as soon as Vite allows that in workers (vitejs/vite#10057)
  if (version.localeCompare('8.4') >= 0) {
    return setup84.setupComposer
  } else if (version.localeCompare('8.1') >= 0) {
    return setup81.setupComposer
  } else {
    return setup74.setupComposer
  }
}

const setupPromises = new Map<string, Promise<(engine: PHP) => void>>()
export function getCachedComposerSetupFunction(
  version: SupportedPHPVersion,
): Promise<(engine: PHP) => void> {
  let setupPromise: Promise<(engine: PHP) => void>

  if (setupPromises.has(version)) {
    setupPromise = setupPromises.get(version)!
  } else {
    setupPromise = getComposerSetupFunction(version)
    setupPromises.set(version, setupPromise)
  }

  return setupPromise
}

export async function evaluate(
  php: PHP,
  code: string,
  setupFunction?: (engine: PHP) => void,
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
  const response = await php.run({ scriptPath: '/arena/index.php' })

  return response.text
}
