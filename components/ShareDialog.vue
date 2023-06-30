<script lang="ts" setup>
const shareStore = useShareStore()

const sharer = useShare()

const permissionRead = usePermission('clipboard-read')
const clipboard = useClipboard({ source: toRef(shareStore, 'url') })
const justCopied = ref(false)

watch(
  () => shareStore.show,
  value => {
    if (value) {
      justCopied.value = false
    }
  },
)

function copy() {
  clipboard.copy(shareStore.url)
  justCopied.value = true
}
</script>

<template>
  <HeadlessTransitionRoot appear :show="shareStore.show" as="template">
    <HeadlessDialog
      as="div"
      @close="shareStore.show = false"
      class="relative z-50"
    >
      <HeadlessTransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-slate-900/25 backdrop-blur-sm dark:bg-slate-500/50"
        />
      </HeadlessTransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <HeadlessTransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <HeadlessDialogPanel
              class="php-arena-prose w-full max-w-xl transform overflow-hidden rounded bg-white px-6 py-10 text-left align-middle shadow-xl transition-all prose-headings:my-0 prose-hr:my-8 dark:bg-slate-800 sm:px-8 sm:py-10 md:px-12 md:py-14"
            >
              <HeadlessDialogTitle as="h2">
                Share this Snippet
              </HeadlessDialogTitle>
              <div class="mt-2 text-base">
                <p>
                  <template v-if="sharer.isSupported.value">
                    Use the button below to share your PHP code with others.
                  </template>
                  <template v-else>
                    Copy the URL below to share your PHP code with others:

                    <input
                      class="-mb-2 mt-6 w-full rounded border-2 border-slate-100 bg-slate-100 px-3 py-3 text-sm text-slate-600 focus:border-violet focus:outline-none dark:border-slate-600 dark:bg-slate-600 dark:text-slate-300 dark:focus:border-violet-400"
                      :value="shareStore.url"
                      readonly
                    />
                  </template>
                </p>
              </div>

              <div class="mt-4 flex items-center gap-7 md:mt-6">
                <template v-if="sharer.isSupported.value">
                  <Button
                    theme="fancy"
                    @click="
                      sharer.share({
                        url: shareStore.url,
                        title: 'PHP Arena Snippet',
                      })
                    "
                    :disabled="permissionRead === 'denied'"
                  >
                    Share
                  </Button>
                </template>
                <template v-else>
                  <Button
                    theme="fancy"
                    @click="copy"
                    :disabled="permissionRead === 'denied'"
                  >
                    Copy URL
                  </Button>
                </template>

                <Button theme="text" @click="shareStore.show = false">
                  Close
                </Button>
              </div>

              <div v-if="!sharer.isSupported && permissionRead === 'denied'">
                <p class="text-sm">
                  Unfortunately, your browser denies copying to your clipboard.
                  Please copy the URL manually.
                </p>
              </div>

              <Alert v-if="justCopied" class="mt-4">
                The URL has been copied to your clipboard.
              </Alert>
            </HeadlessDialogPanel>
          </HeadlessTransitionChild>
        </div>
      </div>
    </HeadlessDialog>
  </HeadlessTransitionRoot>
</template>
