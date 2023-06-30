// @ts-expect-error
import prettier from 'prettier/standalone'
// @ts-expect-error
import HtmlPlugin from 'prettier/parser-html'
// @ts-expect-error
import PhpPlugin from '@prettier/plugin-php/standalone'

import type { SupportedPHPVersion } from '@php-wasm/web'

export function format(
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

  return prettier.format(code, parseOptions)
}
