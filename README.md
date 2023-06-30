<div align="center">
  <br>
  <br>
  <img src="logo.png" alt="The PHP Arena logo: a square boxing ring with a pale 'PHP' writing on the ground" width="256" height="256">

  <br>
</div>

# PHP Arena

> A tiny playground for tinkering with PHP snippets in the browser

This is the source code repository of PHP Arena. You can find the app at [loilo.github.io/php-arena](https://loilo.github.io/php-arena/).

## Technologies

The core technologies this project uses are:

<!-- prettier-ignore -->
Technology | Purpose
-|-
**[Codemirror](https://codemirror.net/)** | A text/code editor, used for the editing area itself.
**[Nuxt](https://nuxt.com/)** | An application framework for Vue.js, used for prerendering, PWA support and overall application structure.
**[`@php-wasm/web`](https://github.com/WordPress/wordpress-playground)** | WASM-compiled builds of the PHP interpreter, made by the WordPress team.
**[`lz-string`](https://www.npmjs.com/package/lz-string)** | A quick and space-efficient compression algorithm, used for serializing the current app state into a shareable URL in as few characters as possible.
**[GitHub Pages](https://pages.github.com/)** | This app does (purposefully) not generate any income. Therefore, free, scalable hosting is essential to keep it running.

## Setup

Clone this repository and install its dependencies using [npm](https://npmjs.com/).

```bash
npm ci
```

## Local Development

Start a local dev server with hot reloading:

```bash
npm run dev
```

## Generate Production Site

Create a production-ready site in the `dist` folder:

```
npm run generate
```

Set the `BASE_URL` environment variable to create a build that can be hosted in a subfolder of a domain, e.g.:

```
BASE_URL=/php-arena/ npm run generate
```
