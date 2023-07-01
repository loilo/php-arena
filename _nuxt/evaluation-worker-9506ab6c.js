var i=Object.defineProperty;var t=(e,n)=>i(e,"name",{value:n,configurable:!0});(function(){"use strict";let webPhpModulePromise;function getWasmModule(baseUrl){return webPhpModulePromise||(webPhpModulePromise=eval(`import("${baseUrl}php-wasm/index.js")`).then(e=>e.WebPHP)),webPhpModulePromise}t(getWasmModule,"getWasmModule");function getPhpEngine(e,n){return getWasmModule(e).then(r=>r.load(n,{requestHandler:{documentRoot:"/arena"}}))}t(getPhpEngine,"getPhpEngine");const enginePromises=new Map;function getCachedPhpEngine(e,n){let r;return enginePromises.has(n)?r=enginePromises.get(n):(r=getPhpEngine(e,n),enginePromises.set(n,r)),r}t(getCachedPhpEngine,"getCachedPhpEngine");async function evaluate(e,n){return e.fileExists("/arena")&&e.rmdir("/arena",{recursive:!0}),e.mkdir("/arena"),e.writeFile("/arena/index.php",`<?php require_once __DIR__ . '/vendor/autoload.php' ?>${n}`),(await e.run({scriptPath:"/arena/index.php"})).text}t(evaluate,"evaluate");function ensureRecord(e){if(typeof e!="object"||e===null)throw new Error("Invalid message")}t(ensureRecord,"ensureRecord");function validateMessage(e){if(ensureRecord(e),typeof e.id!="string")throw new Error("Invalid message id");if(e.type!=="evaluate")throw new Error("Invalid message type");if(typeof e.code!="string")throw new Error("Invalid message payload: code");if(typeof e.baseUrl!="string")throw new Error("Invalid message payload: baseUrl");if(!["5.6","7.0","7.1","7.2","7.3","7.4","8.0","8.1","8.2"].includes(e.version))throw new Error("Invalid PHP version")}t(validateMessage,"validateMessage"),addEventListener("message",async e=>{const n=e.data;validateMessage(n);const r=await getCachedPhpEngine(n.baseUrl,n.version),a=await evaluate(r,n.code);postMessage({type:"evaluated",payload:a,id:n.id})})})();
