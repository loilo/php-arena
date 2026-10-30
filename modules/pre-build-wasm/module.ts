// The manifest.webmanifest file is placed in the wrong folder by VitePWA,
// so we need to fix this after building.

import { defineNuxtModule } from '@nuxt/kit'
import * as path from 'node:path'
import { consola } from 'consola'
import { build } from 'vite'

export default defineNuxtModule({
  async setup(_options, nuxt) {
    nuxt.hook('ready', async () => {
      const publicDir = path.isAbsolute(nuxt.options.dir.public)
        ? nuxt.options.dir.public
        : path.join(nuxt.options.rootDir, nuxt.options.dir.public)
      const target = path.join(publicDir, 'php-wasm')
      const entry = path.join(
        nuxt.options.rootDir,
        'modules/pre-build-wasm/entry.js',
      )

      await build({
        configFile: false,
        root: nuxt.options.rootDir,
        base: `${nuxt.options.app.baseURL}php-wasm/`,
        publicDir: false,
        assetsInclude: ['**/*.wasm', '**/*.dat', '**/*.so', '**/*.la'],
        build: {
          outDir: target,
          emptyOutDir: true,
          assetsInlineLimit: 0,
          modulePreload: false,
          rollupOptions: {
            preserveEntrySignatures: 'strict',
            input: entry,
            output: {
              format: 'es',
              entryFileNames: 'index.js',
            },
          },
        },
      })

      consola.success('Pre-compiled @php-wasm/web')
    })
  },
})
