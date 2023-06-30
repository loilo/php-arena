<script lang="ts" setup>
withDefaults(
  defineProps<{
    visible?: boolean
  }>(),
  {
    visible: true,
  },
)
</script>

<template>
  <div
    class="pointer-events-none absolute right-0 top-0 z-10 rounded-bl-md bg-slate-100 px-3 py-3 text-sm leading-none transition-opacity dark:bg-slate-800 dark:text-slate-400"
    :class="{ 'opacity-0': !visible }"
  >
    <slot />
  </div>
</template>
