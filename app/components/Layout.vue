<template>
  <div
    class="grid h-full min-h-0 grid-cols-[1fr] grid-rows-[1fr_var(--divider-width)_1fr_auto] transition-[grid-template-columns] duration-500 md:grid-cols-[1fr_var(--divider-width)_1fr_var(--sidebar-width)] md:grid-rows-[1fr]"
    :style="{ '--divider-width': '0.125rem', '--sidebar-width': '6.75rem' }"
  >
    <div class="col-span-2 min-h-0 md:col-span-1">
      <slot name="actions" />
    </div>
    <div class="col-span-1 col-start-1 row-span-1 row-start-1 min-h-0 min-w-0">
      <slot name="left" />
    </div>
    <div
      class="col-span-1 col-start-1 row-span-1 row-start-2 md:col-start-2 md:row-start-1"
    >
      <slot name="divider" />
    </div>
    <div
      class="col-span-1 col-start-1 row-span-1 row-start-3 min-h-0 min-w-0 md:col-start-3 md:row-start-1"
    >
      <slot name="right" />
    </div>
  </div>
</template>
