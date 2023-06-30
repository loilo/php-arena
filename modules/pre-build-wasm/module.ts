// The manifest.webmanifest file is placed in the wrong folder by VitePWA,
// so we need to fix this after building.

import { defineNuxtModule } from '@nuxt/kit'

import * as fs from 'fs-extra'
import * as path from 'node:path'
import consola from 'consola'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'

export default defineNuxtModule({
  async setup(_options, nuxt) {
    nuxt.hook('ready', async () => {
      const target = path.join(
        nuxt.options.rootDir,
        nuxt.options.dir.public,
        'php-wasm',
      )

      fs.removeSync(target)
      const bundle = await rollup({
        input: '@php-wasm/web',
        plugins: [
          nodeResolve(),
          url({
            include: ['**/*.wasm'],
            publicPath: '/php-wasm/',
          }),
        ],
      })
      await bundle.write({
        dir: target,
        format: 'es',
      })
      await bundle.close()

      consola.success('Pre-compiled @php-wasm/web')
    })
  },
})
