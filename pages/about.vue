<script lang="ts" setup></script>

<template>
  <div class="px-4 pb-8 pt-4 sm:px-8 sm:py-8 md:px-16 md:py-12">
    <div class="php-arena-prose mx-auto lg:prose-lg xl:prose-xl">
      <header class="flex justify-between">
        <NuxtLink to="/" class="flex items-center gap-[1.5ch]">
          <!-- prettier-ignore -->
          <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="448" height="512" class="w-auto h-[1.25em]"><path fill="currentColor" d="M231.536 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L60.113 273H436c6.627 0 12-5.373 12-12v-10c0-6.627-5.373-12-12-12H60.113L238.607 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L3.515 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"></path></svg>
          <span class="whitespace-nowrap">to the app</span>
        </NuxtLink>
        <ColorModeSwitch />
      </header>

      <!-- prettier-ignore -->
      <svg class="mx-auto my-8 md:mb-16 h-auto w-32 sm:w-40 md:w-48 lg:w-60 [filter:drop-shadow(0_0.2rem_0.5rem_rgb(0_0_0_/_20%))] dark:[filter:drop-shadow(0_0.25rem_1rem_rgb(0_0_0_/_30%))]" aria-hidden="true" focusable="false" width="512" height="462" viewBox="0 0 512 462" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M505.388 107.494 249.412.827a10.665 10.665 0 0 0-9.215.47l-234.644 128A10.672 10.672 0 0 0 0 138.85a10.672 10.672 0 0 0 5.894 9.347l255.975 128a10.665 10.665 0 0 0 10.495-.533L507.01 126.331c4.967-3.166 6.427-9.76 3.262-14.728a10.674 10.674 0 0 0-4.883-4.109Z" id="a"/></defs><g fill="none" fill-rule="evenodd"><path d="M511.969 301.147a10.665 10.665 0 0 1-4.907 9.813L272.42 460.294a11.303 11.303 0 0 1-5.76 1.707v-223.36l245.31-10.453s-.426 68.906 0 72.959Z" fill="#4750AE" fill-rule="nonzero"/><path d="M266.66 462a11.618 11.618 0 0 1-4.693-1.067l-255.976-128a10.666 10.666 0 0 1-5.972-9.387v-73.6l266.64-11.306V462Z" fill="#6872C4" fill-rule="nonzero"/><path d="M249.424 110.165a10.665 10.665 0 0 0-9.215.469l-224.645 118a10.667 10.667 0 0 0 .34 18.901l245.977 118a10.665 10.665 0 0 0 10.495-.533L497.02 225.669c4.968-3.166 6.427-9.76 3.262-14.728a10.674 10.674 0 0 0-4.883-4.109l-245.975-96.667Z" fill="#D2CFDC" fill-rule="nonzero"/><g transform="translate(.011 99.338)"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><path d="M177.59 80.005c14.794 0 25.03 3.896 30.694 11.58 6.068 7.725 6.791 18.523 1.647 32.093-2.177 5.529-5.291 10.664-9.287 15.26-4.093 4.603-9.272 8.861-15.418 12.66a81.245 81.245 0 0 1-24.444 9.962c-8.607 1.95-19.277 2.938-31.646 2.938H104.21l-19.974 27.159c-.803 1.054-2.517 1.815-4.087 1.815H45.441c-.978 0-1.732-.299-2.05-.816-.316-.517-.167-1.197.407-1.855l83.6-108.981c.702-1.054 2.007-1.815 3.114-1.815h47.077Zm197.72 0c15.687 0 29.324 3.896 40.852 11.58 12.017 7.724 20.644 18.522 25.166 32.093 1.782 5.529 2.298 10.664 1.492 15.26-.894 4.603-3.187 8.861-6.841 12.66-4.494 4.63-10.7 7.987-18.371 9.962-7.643 1.95-18.203 2.938-31.317 2.938h-26.429l-.275 27.159c-.033 1.054-1.258 1.815-2.924 1.815h-36.798c-1.037 0-2.069-.299-2.808-.816-.738-.517-1.109-1.197-1.012-1.855l7.348-108.981c-.009-1.054.83-1.815 2.005-1.815h49.912ZM256.842 51.638c.6 0 1.167.3 1.546.816.381.518.534 1.197.416 1.855l-5.206 26.304h18.198c13.864 0 23.568 2.452 29.813 7.498 6.572 5.147 9.796 13.377 9.311 24.465l-4.255 50.714c-.125 1.054-1.225 1.816-2.625 1.816h-31.168c-.873 0-1.709-.3-2.278-.817-.57-.517-.813-1.196-.666-1.854l9.105-48.22c.7-4.586.249-7.878-1.236-9.268l-.122-.11c-.987-.838-3.606-2.11-10.48-2.165l-18.705-.001-17.644 60.619c-.355 1.054-1.623 1.816-3.022 1.816h-30.681c-.873 0-1.644-.3-2.102-.817-.457-.517-.552-1.197-.263-1.854L233.58 53.453c.289-1.053 1.192-1.815 2.154-1.815h21.108Zm-94.45 50.287h-16.735l-27.061 42.55h15.56c11.977 0 21.461-1.721 28.1-5.114 6.451-3.359 11.775-9.177 15.826-17.294 3.682-7.586 4.37-12.883 2.159-15.742-2.207-2.92-8.199-4.4-17.85-4.4Zm214.289 0h-16.735l3.761 42.55h15.56c11.977 0 20.195-1.721 24.341-5.114 3.993-3.358 5.07-9.177 3.23-17.294-1.793-7.586-4.909-12.883-9.167-15.742-4.292-2.92-11.34-4.4-20.99-4.4Z" fill="#C1BCD1" fill-rule="nonzero" mask="url(#b)"/></g><path d="M245.328 0c5.89 0 10.666 4.776 10.666 10.667v28.228l234.644 97.778v-19.339c0-5.891 4.776-10.667 10.667-10.667 5.89 0 10.666 4.776 10.666 10.667v34.835c.012.343.012.687 0 1.033V302c0 3.646-1.855 7.041-4.928 9.003L272.398 460.336a10.694 10.694 0 0 1-10.517.533l-255.976-128a10.666 10.666 0 0 1-5.887-9.536v-84.898a7.598 7.598 0 0 1 0-.885l-.001-62.97a10.634 10.634 0 0 1 0-1.189v-34.724C.018 132.776 4.794 128 10.684 128c5.89 0 10.666 4.776 10.666 10.667v17.368L234.662 39.671V10.667C234.662 4.776 239.438 0 245.328 0Zm21.615 376.663-.284.004c-.145 0-.29-.003-.433-.009l-.347-.02a10.592 10.592 0 0 1-3.834-1.018L21.349 255.258v61.484l244.692 122.347L490.64 296.156v-60.06L272.613 374.852a10.605 10.605 0 0 1-5.157 1.786l-.234.014-.279.011ZM72.111 216.642l-38.41 20.953L255.992 348.73v-40.139L72.111 216.642Zm369.449-13.313L277.325 307.852v38.721L478.33 218.651l-36.77-15.322Zm-195.613-81.51L94.931 204.194l161.062 80.545v-18.072c0-5.891 4.776-10.667 10.666-10.667 5.89 0 10.666 4.776 10.666 10.667v15.89L417.54 193.32l-171.593-71.501ZM21.349 191.258v28.766l27.512-15.008-27.512-13.758Zm469.289-19.164-27.146 17.276 27.146 11.312v-28.588ZM234.662 63.974 33.718 173.582l37.964 18.985 162.98-88.907V63.974Zm21.332-1.968v40.898l183.479 76.457 38.832-24.714-222.311-92.641Z" class="dark:fill-slate-700" fill="#19212F" fill-rule="nonzero"/></g></svg>

      <div>
        <h1>About PHP Arena</h1>
        <p>
          PHP Arena is a tiny playground for tinkering with PHP code snippets.
          Other than most similar sites, it ships the whole PHP interpreter to
          the browser, making the execution very fast and also completely
          independent of the user's internet connection, so the app can be
          installed and used offline.
        </p>
      </div>
      <hr class="ruler" />
      <footer class="footer">
        PHP Arena is Open Source software under the MIT license. Feel free to
        leave feedback or contribute improvements in our
        <a href="https://github.com/loilo/php-arena" class="link github-link">
          <!-- prettier-ignore -->
          <svg aria-hidden="true" focusable="false" class="h-[1.25em] -mt-[0.15em] ml-[0.4ch] mr-[0.2ch] w-auto inline-block" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
          GitHub repository</a
        >.
      </footer>
    </div>
  </div>
</template>

<style lang="scss">
.list {
  @apply flex list-none flex-col items-start gap-2 pl-6;
}

.list li {
  &::before {
    content: '';
    @apply absolute h-[0.55em] w-[0.55em] translate-x-[calc(-100%_-_0.65em)] translate-y-[0.55em] bg-gradient-to-t from-violet-500 to-violet-400;
    clip-path: polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%);
  }
}
</style>
