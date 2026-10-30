<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { indentWithTab } from '@codemirror/commands'
import { EditorView, keymap } from '@codemirror/view'
import {
  syntaxHighlighting,
  type HighlightStyle,
  type LanguageSupport,
} from '@codemirror/language'
import { EditorState, type Extension } from '@codemirror/state'
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching,
  defaultHighlightStyle,
  indentOnInput,
} from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import {
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  lineNumbers,
  rectangularSelection,
  type KeyBinding,
} from '@codemirror/view'

export type SetupFlags = {
  lineNumbers: boolean
}

function getBasicSetup(flags: Partial<SetupFlags> = {}) {
  const options: SetupFlags = {
    lineNumbers: true,
    ...flags,
  }

  return [
    options.lineNumbers ? lineNumbers() : undefined,
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap.filter(map => map.key !== 'Mod-Enter'),
      ...searchKeymap,
      ...historyKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ] as readonly KeyBinding[]),
  ].filter(Boolean) as Extension
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    language?: LanguageSupport
    readonly?: boolean
    lineNumbers?: boolean
    highlightStyle?: HighlightStyle
    theme?: Extension
    extensions?: Extension[]
  }>(),
  {
    modelValue: '',
    readonly: false,
    lineNumbers: false,
    extensions: () => [],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'submit'): void
}>()

const editorEl = ref<Element>()
const editor = ref<EditorView>()
const focused = ref<boolean>(false)

const isProgrammingEditor = computed(
  () => typeof props.language !== 'undefined',
)

let lastEmitted: string
const actualExtensions = computed(() => {
  const extensions: Extension[] = [
    getBasicSetup({
      lineNumbers: props.lineNumbers,
    }),
    EditorView.lineWrapping,
    EditorView.domEventHandlers({
      focus() {
        focused.value = true
        emit('focus')
      },
      blur() {
        focused.value = false
        emit('blur')
      },
    }),
  ]

  if (props.readonly) {
    extensions.push(
      EditorView.editable.of(false),
      EditorView.contentAttributes.of({ tabIndex: '0' }),
    )
  }

  if (props.highlightStyle) {
    extensions.push(syntaxHighlighting(props.highlightStyle))
  }

  if (props.theme) {
    extensions.push(props.theme)
  }

  if (props.language) {
    extensions.push(props.language)
  }

  if (isProgrammingEditor.value) {
    extensions.push(keymap.of([indentWithTab]))

    const modEnterExtension = keymap.of([
      {
        key: 'Mod-Enter',
        preventDefault: true,
        run: () => {
          emit('submit')
          return false
        },
      },
    ])
    extensions.push(modEnterExtension)
  }

  if (props.extensions) {
    extensions.push(...props.extensions)
  }

  const updateListenerExtension = EditorView.updateListener.of(update => {
    if (update.docChanged) {
      lastEmitted = editor.value!.state.doc.toString()
      emit('update:modelValue', lastEmitted)
    }
  })

  extensions.push(updateListenerExtension)

  return extensions
})

function createState() {
  const state = EditorState.create({
    doc: props.modelValue,
    extensions: actualExtensions.value,
  })
  return state
}

function recreateEditor() {
  if (editor.value) {
    editor.value.destroy()
  }

  editor.value = new EditorView({
    state: createState(),
    parent: editorEl.value,
  })
}

watch(editorEl, editorElement => {
  if (!editorElement) return
  recreateEditor()
})

onUnmounted(() => {
  editor.value!.destroy()
})

watch(
  actualExtensions,
  () => {
    recreateEditor()
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  newValue => {
    if (newValue !== lastEmitted) {
      recreateEditor()
    }
  },
)
</script>

<template>
  <div
    class="editor text-sm md:text-base"
    :class="{ 'editor-focused': focused }"
    ref="editorEl"
  />
</template>

<style lang="scss" scoped>
.editor {
  height: 100%;

  :deep(.cm-scroller) {
    padding-right: 2px;
  }

  &.editor-focused {
    z-index: 1;

    :deep(.cm-focused) {
      outline: none;
    }
  }
}

.editor > :deep(.cm-editor) {
  height: 100%;
}
</style>
