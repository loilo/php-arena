<script lang="ts" setup>
import * as darkTheme from '@/assets/theme-dark'
import * as lightTheme from '@/assets/theme-light'
import { php } from '@codemirror/lang-php'
import { keymap } from '@codemirror/view'
import type { SupportedPHPVersion } from '@php-wasm/web'

const themeStore = useColorThemeStore()

const inputCodeStore = useInputCodeStore()
const phpVersionStore = usePhpVersionStore()
const autoRunStore = useAutoRunStore()
const outputModeStore = useOutputModeStore()

const inputFocused = ref(false)
const throttledInputCode = refDebounced(toRef(inputCodeStore, 'state'), 850)
const evaluatedInputCode = ref('')
watch(
  throttledInputCode,
  throttledInputCodeValue => {
    if (!autoRunStore.state) return

    evaluatedInputCode.value = throttledInputCodeValue
  },
  { immediate: true },
)
const evaluatedPhpVersion = ref<SupportedPHPVersion>('8.2')
watch(
  () => phpVersionStore.state,
  phpVersion => {
    if (!autoRunStore.state) return

    evaluatedPhpVersion.value = phpVersion
  },
  { immediate: true },
)

const outputCode = useEvaluator(evaluatedInputCode, evaluatedPhpVersion)

const throttledOutputCode = ref('')
watch(outputCode, outputCodeValue => {
  // Don't override throttled output code if output is not ready or there is an error
  if (typeof outputCodeValue === 'undefined') return

  throttledOutputCode.value = outputCodeValue
})

// When re-enabling auto running, re-evaluate the input code and version
watch(
  () => autoRunStore.state,
  autoRun => {
    if (!autoRun) return
    if (typeof outputCode.value === 'undefined') return

    evaluatedInputCode.value = inputCodeStore.state
    evaluatedPhpVersion.value = phpVersionStore.state
  },
)

const throttledHtmlOutputCode = computed(
  () => `<style>
:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  padding: 1.5rem 2rem;
  color: ${
    themeStore.theme === 'dark' ? darkTheme.colors.base : lightTheme.colors.base
  };
}

:root, body {
  margin: 0;
}
</style>${throttledOutputCode.value}`,
)

const inputExtensions = [
  keymap.of([
    {
      key: 'Mod-Enter',
      preventDefault: true,
      run: () => {
        if (autoRunStore.state) return true
        evaluatedInputCode.value = inputCodeStore.state
        return false
      },
    },
  ]),
]
const phpLanguage = php()
const editorThemeData = computed(() =>
  themeStore.theme === 'dark' ? darkTheme : lightTheme,
)
</script>

<template>
  <div
    class="flex h-[100dvh] flex-col items-stretch"
    :style="{
      '--sidebar-measure': '6.75rem',
      '--sidebar-width': 'var(--sidebar-measure)',
      '--divider-width': '0.125rem',
    }"
  >
    <ShareDialog />

    <Layout>
      <template #actions>
        <Actions />
      </template>

      <template #left>
        <div class="relative h-full w-full">
          <CornerTag :visible="!inputFocused"
            >PHP
            <small class="ml-1">{{ phpVersionStore.state }}</small></CornerTag
          >
          <Editor
            :language="phpLanguage"
            v-model="inputCodeStore.state"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            :theme="editorThemeData.theme"
            :highlight-style="editorThemeData.highlightStyle"
            line-numbers
            :extensions="inputExtensions"
          />
        </div>
      </template>

      <template #divider>
        <hr class="h-full w-full border-none bg-slate-100 dark:bg-slate-800" />
        <button
          @click="evaluatedInputCode = inputCodeStore.state"
          class="3xl:p-4 absolute left-1/2 z-20 -translate-x-1/2 translate-y-[calc(-50%_+_0.5_*_var(--divider-width))] rounded-full bg-violet-600 p-3 text-white shadow-[0_0.1rem_0.125rem_rgb(0_0_0_/_25%),0_0.25rem_1rem_rgb(0_0_0_/_25%)] transition-opacity duration-150 hover:bg-violet-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500 active:scale-[0.96] active:bg-violet-700 active:text-violet-100 md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-[calc(-50%_+_0.5_*_var(--divider-width))] xl:p-3.5"
          :class="{
            'pointer-events-none opacity-0': autoRunStore.state,
          }"
          :inert="autoRunStore.state"
        >
          <!-- prettier-ignore -->
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 xl:w-5 xl:h-5 3xl:w-6 3xl:h-6 translate-x-[10%]" viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>
          <span class="sr-only">Play</span>
        </button>
      </template>

      <template #right>
        <div class="group relative h-full w-full">
          <CornerTag
            class="group-hover:pointer-events-none group-hover:opacity-0"
            >Output</CornerTag
          >
          <pre
            v-if="outputModeStore.state === 'raw'"
            class="h-full overflow-auto whitespace-pre-wrap p-4 text-[#565869] dark:text-[#D9D7CE] md:px-8 md:py-6"
            >{{ throttledOutputCode }}</pre
          >
          <iframe
            v-else
            class="h-full w-full"
            sandbox="allow-scripts allow-modals"
            :srcdoc="throttledHtmlOutputCode"
          />
        </div>
      </template>
    </Layout>
  </div>
</template>

<style lang="scss" scoped>
:deep(.cm-report-gutter-error) {
  display: inline-flex;
  width: 0.6em;
  height: 0.6em;
  border-radius: 50%;
}

:deep(.cm-diagnosticText) {
  @apply font-mono;
}
</style>
