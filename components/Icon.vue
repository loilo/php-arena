<script lang="ts" setup>
const props = defineProps<{
  name: string
  alt?: string
}>()

const iconUrl = computed(() => useAbsoluteUrl(`icons/${props.name}.svg`))
const iconCssUrl = computed(() => `url('${iconUrl.value}')`)
</script>

<template>
  <div
    data-icon-component
    class="icon inline-flex"
    :style="{ '--icon-mask': iconCssUrl }"
  >
    <img class="block opacity-0" :src="iconUrl" :alt="alt" draggable="false" />
  </div>
</template>

<style scoped>
.icon {
  mask-image: var(--icon-mask);
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  mask-position: center;
}

:global(:where(.icon[data-icon-component])) {
  background-color: currentColor;
}
</style>
