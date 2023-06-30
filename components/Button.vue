<script lang="ts" setup>
withDefaults(
  defineProps<{
    theme?: 'text' | 'fancy'
  }>(),
  {
    theme: 'text',
  },
)
</script>

<template>
  <ActionTrigger
    :class="{
      'inline-flex justify-center rounded bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow [text-shadow:0_0.125em_0.25em_rgba(0,0,0,0.15)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet disabled:bg-slate-100 disabled:bg-none disabled:text-slate-300 disabled:[text-shadow:none] not-disabled:hover:bg-violet-500 not-disabled:active:translate-y-px not-disabled:active:scale-[0.98] not-disabled:active:bg-violet-700 not-disabled:active:text-violet-100 dark:bg-violet-600 dark:text-violet-50 dark:focus-visible:outline-violet-400 dark:disabled:bg-slate-400 dark:disabled:text-slate-300 dark:not-disabled:hover:bg-violet-500 dark:not-disabled:hover:text-white dark:not-disabled:active:bg-violet-700 dark:not-disabled:active:text-violet-100 md:px-5 md:py-2.5':
        theme === 'fancy',
      'inline-flex text-sm text-violet-900 underline decoration-violet-400 underline-offset-2 disabled:text-slate-300 disabled:decoration-slate-100 not-disabled:hover:text-violet-700 not-disabled:active:text-violet-800 dark:text-violet-200 dark:decoration-violet-400 dark:disabled:text-slate-500 dark:disabled:decoration-slate-600 dark:not-disabled:hover:text-violet-100 dark:not-disabled:active:text-violet-400':
        theme === 'text',
    }"
    v-bind="$attrs"
    ><slot
  /></ActionTrigger>
</template>
