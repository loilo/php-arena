export function useShortcut(
  key: MaybeRef<string | undefined>,
  { type = 'name' }: { type?: 'name' | 'code' } = {},
) {
  const shortcutStore = useShortcutStore()
  const modifierPressed = computed(() => shortcutStore.active)
  const keyPressed = ref(false)

  const scope = effectScope()

  scope.run(() => {
    const innerKeyPressed = ref(false)
    useEventListener('keydown', event => {
      if (!modifierPressed.value) return
      if (event.code !== unref(key)) return

      event.preventDefault()
      innerKeyPressed.value = true
    })
    useEventListener('keyup', event => {
      if (event.code !== unref(key)) return
      if (!keyPressed.value) return

      innerKeyPressed.value = false
    })

    syncRefs(innerKeyPressed, keyPressed)
  })

  return {
    pressed: logicAnd(modifierPressed, keyPressed),
    stop: () => {
      scope.stop()
    },
  }
}

export function useShortcutFn(
  key: MaybeRef<string | undefined>,
  callback: () => void,
) {
  const { pressed, stop } = useShortcut(key)

  const unwatch = watch(pressed, isPressed => {
    if (isPressed) callback()
  })

  return () => {
    unwatch()
    stop()
  }
}
