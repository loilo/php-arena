if(!self.define){let e,n={};const i=(i,r)=>(i=new URL(i+".js",r).href,n[i]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=n,document.head.appendChild(e)}else e=i,importScripts(i),n()})).then((()=>{let e=n[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let a={};const c=e=>i(e,o),l={module:{uri:o},exports:a,require:c};n[o]=Promise.all(r.map((e=>l[e]||c(e)))).then((e=>(s(...e),a)))}}define(["./workbox-fa446783"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_nuxt/_plugin-vue_export-helper.a0691a9b.js",revision:null},{url:"_nuxt/about.03dea2bc.css",revision:null},{url:"_nuxt/about.32d98420.js",revision:null},{url:"_nuxt/color-theme.1b8ca31c.js",revision:null},{url:"_nuxt/color-theme.84e4043a.css",revision:null},{url:"_nuxt/entry.1293da3e.js",revision:null},{url:"_nuxt/error-404.8bdbaeb8.css",revision:null},{url:"_nuxt/error-404.b75f7a51.js",revision:null},{url:"_nuxt/error-500.287c7d32.js",revision:null},{url:"_nuxt/error-500.b63a96f5.css",revision:null},{url:"_nuxt/evaluation-worker-3b7a885e.js",revision:null},{url:"_nuxt/formatting-worker-835814bd.js",revision:null},{url:"_nuxt/index.402eeb21.js",revision:null},{url:"_nuxt/index.76608a08.css",revision:null},{url:"_nuxt/nuxt-link.9b2386c4.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.c8506043.js",revision:null},{url:"200",revision:"fac42ea7f99148439c234c618936d3e5"},{url:"404",revision:"fac42ea7f99148439c234c618936d3e5"},{url:"about",revision:"163a40c58a4c9b557ad803a0ce71f5f6"},{url:"apple-touch-icon.png",revision:"473d9664ee547da38e0cace32ede8e8e"},{url:"css/nuxt-google-fonts.css",revision:"9df13e239ac42318acdcf5b6a65bacb6"},{url:"favicon-16x16.png",revision:"ea1b82de4ad998bf6d7737763209b7b7"},{url:"favicon-32x32.png",revision:"06b72e99b897a39b63b7bd324547a527"},{url:"favicon.ico",revision:"f494945f347c1cc793cc0a80436ee8ec"},{url:"favicon.svg",revision:"1e48d4c8d288048f66430f24407990b8"},{url:"fonts/JetBrains_Mono-400-1.woff2",revision:"9c71fb9c181fc60fc5e2ebca5879b813"},{url:"fonts/JetBrains_Mono-400-2.woff2",revision:"f0ae0e53748b0dd2f29b69faedaac0d1"},{url:"fonts/JetBrains_Mono-400-3.woff2",revision:"6302653735cb53f957aa724e8487edeb"},{url:"fonts/JetBrains_Mono-400-4.woff2",revision:"a45a37a7d5f8b1a1638c6c15c28a09e4"},{url:"fonts/JetBrains_Mono-400-5.woff2",revision:"6239768b298b1ba993bdf23a4121ffcc"},{url:"fonts/JetBrains_Mono-400-6.woff2",revision:"0062bf1cab808369fb574e2da7e02c0a"},{url:"fonts/Poppins-400-7.woff2",revision:"790d0c8dbcd491d29d58f1369c199d40"},{url:"fonts/Poppins-400-8.woff2",revision:"0ed299a4bb5262e17e2145783b2c18f1"},{url:"fonts/Poppins-400-9.woff2",revision:"9212f6f9860f9fc6c69b02fedf6db8c3"},{url:"icons/arena.svg",revision:"8b13256feebc2e7d3aaab8d4d161235d"},{url:"icons/blank.svg",revision:"1a1780d1e4d919c9faf377ce4c676784"},{url:"icons/code.svg",revision:"d6f415566ac05a500dddabdb326b0d3f"},{url:"icons/github.svg",revision:"2b90b56c89b34cb8d8ceec568da194c5"},{url:"icons/html.svg",revision:"b7bd59b529297d3aea1d5f6f3c340a7b"},{url:"icons/info.svg",revision:"6c3253982f77678a0fa8b8b9ecb8e7e8"},{url:"icons/lines.svg",revision:"a188ff7f6a44fd957c1db0281848b387"},{url:"icons/moon.svg",revision:"c3e383d3049326c460ca289abaa40351"},{url:"icons/php.svg",revision:"1c97b1aec5b497d6422a695eae1ad489"},{url:"icons/redo.svg",revision:"18ee58fe85cce3e44e0b0c2327cfe50b"},{url:"icons/screen.svg",revision:"914be258429bfd0289d8ff25281e71bc"},{url:"icons/share.svg",revision:"2b0436b51046b1f6ffb27ed63748804d"},{url:"icons/sun.svg",revision:"4aeda03828fb0bedd25d4dc6d0facb14"},{url:"icons/wand.svg",revision:"7a7854a739eda966b6b0ca0c975f0e39"},{url:"/php-arena/",revision:"28a5e8b95f854a873f313be808c10d83"},{url:"maskable.svg",revision:"0177f23626aabef20eb36bcde385ed81"},{url:"php-arena-pwa-192x192.png",revision:"0eb3ddb484fc2bd0030ef46cb57fda94"},{url:"php-arena-pwa-512x512-maskable.png",revision:"be049cc0e85f1275c645a9728d6592c8"},{url:"php-arena-pwa-512x512.png",revision:"def56adcd2a529756a19f13044341c08"},{url:"php-wasm/index.js",revision:"ebd77dd29cd578791914e846f1a152b9"},{url:"php-wasm/php_5_6-e9afad21.js",revision:null},{url:"php-wasm/php_7_0-75c1b9f8.js",revision:null},{url:"php-wasm/php_7_1-2c4747f8.js",revision:null},{url:"php-wasm/php_7_2-2f277b71.js",revision:null},{url:"php-wasm/php_7_3-3fb0b4c8.js",revision:null},{url:"php-wasm/php_7_4-dad64529.js",revision:null},{url:"php-wasm/php_8_0-382336b4.js",revision:null},{url:"php-wasm/php_8_1-12a718ff.js",revision:null},{url:"php-wasm/php_8_2-00ac9e6d.js",revision:null},{url:"manifest.webmanifest",revision:"acf6077cca0fb2af1a98cc054882a17a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/php-arena/")))}));
