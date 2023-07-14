export const useShortcutStore = defineStore('shortcut', () => {
  if (typeof navigator !== 'object') return { active: ref(false) }

  const { ctrl, shift } = useMagicKeys()

  const active = logicAnd(ctrl, shift)

  return { active }
})
