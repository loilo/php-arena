import prettier from 'prettier/standalone'
import * as HtmlPlugin from 'prettier/plugins/html'
// @ts-expect-error
import * as PhpPlugin from '@prettier/plugin-php/standalone'

import type { SupportedPHPVersion } from '@php-wasm/web'

export async function format(
  code: string,
  {
    printWidth = 80,
    tabWidth = 4,
    useTabs = true,
    singleQuote = true,
    phpVersion = '8.2',
    trailingCommaPHP = false,
    braceStyle = 'psr-2',
    requirePragma = false,
    insertPragma = false,
  }: {
    printWidth?: number
    tabWidth?: number
    useTabs?: boolean
    singleQuote?: boolean
    phpVersion?: SupportedPHPVersion
    trailingCommaPHP?: boolean
    braceStyle?: 'per-cs' | '1tbs' | 'psr-2'
    requirePragma?: boolean
    insertPragma?: boolean
  },
) {
  // Prettier does not support PHP 8.3 yet
  if (phpVersion === '8.3') {
    phpVersion = '8.2'
  }

  const parseOptions = {
    phpVersion,
    printWidth,
    tabWidth,
    useTabs,
    singleQuote,
    trailingCommaPHP,
    braceStyle,
    requirePragma,
    insertPragma,
    plugins: [HtmlPlugin, PhpPlugin],
    parser: 'php',
  }

  return await prettier.format(code, parseOptions)
}
