<!--
A "renderless" component that represents various kinds of buttons in this app:
- regular, interactive buttons
- internal or external links (by passing a 'link' attribute)

Can be used as the root element of another component to avoid having to implement
this functionality in multiple places.
-->

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script lang="ts" setup>
import { NuxtLink } from '#components'

const props = withDefaults(
  defineProps<{
    link?: string
    disabled?: boolean
  }>(),
  {
    link: undefined,
    disabled: false,
  },
)

const hasLink = computed(() => typeof props.link !== 'undefined')
const hasTextLink = computed(() => typeof props.link === 'string')
const hasAnchorLink = computed(
  () => hasTextLink.value && props.link!.startsWith('#'),
)
const hasExternalLink = computed(
  () => hasTextLink.value && /^https?:\/\//.test(props.link!),
)
const hasRouterLink = computed(
  () => hasLink.value && !hasAnchorLink.value && !hasExternalLink.value,
)
const component = computed(() => {
  if (props.disabled) {
    return 'button'
  } else if (hasLink.value && !hasExternalLink.value) {
    return NuxtLink
  } else if (hasLink.value) {
    return 'a'
  } else {
    return 'button'
  }
})

const attrs = useAttrs()

const componentAttrs = computed(() => {
  if (!props.disabled) {
    // Don't apply hrefs if link is "disabled"

    if (hasRouterLink.value) {
      return { to: props.link }
    } else if (hasLink.value) {
      const resultingAttrs: Record<string, string> = { href: props.link! }

      if ('target' in attrs) {
        resultingAttrs.rel = 'noopener'
      }

      return resultingAttrs
    } else {
      return { type: 'button' }
    }
  } else {
    return {
      disabled: true,
    }
  }
})
</script>

<template>
  <component
    :is="component"
    v-bind="{ ...componentAttrs, ...$attrs } as any"
    :class="{ 'cursor-pointer': !disabled, 'cursor-default': disabled }"
  >
    <slot
      v-bind="{
        link: hasLink,
        external: hasExternalLink,
        anchor: hasAnchorLink,
      }"
    />
  </component>
</template>
