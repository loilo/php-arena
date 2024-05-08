var D = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
};
var d = (e, t, r) => (D(e, t, "read from private field"), r ? r.call(e) : t.get(e)), u = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, m = (e, t, r, s) => (D(e, t, "write to private field"), t.set(e, r), r);
var p = (e, t, r) => (D(e, t, "access private method"), r);
const currentJsRuntime$1 = function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (currentJsRuntime$1 === "NODE") {
  let e = function(r) {
    return new Promise(function(s, n) {
      r.onload = r.onerror = function(o) {
        r.onload = r.onerror = null, o.type === "load" ? s(r.result) : n(new Error("Failed to read the blob/file"));
      };
    });
  }, t = function() {
    const r = new Uint8Array([1, 2, 3, 4]), n = new File([r], "test").stream();
    try {
      return n.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class r extends Blob {
      constructor(n, o, i) {
        super(n);
        let a;
        i != null && i.lastModified && (a = /* @__PURE__ */ new Date()), (!a || isNaN(a.getFullYear())) && (a = /* @__PURE__ */ new Date()), this.lastModifiedDate = a, this.lastModified = a.getMilliseconds(), this.name = o || "";
      }
    }
    global.File = r;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const s = new FileReader();
    return s.readAsArrayBuffer(this), e(s);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const s = new FileReader();
    return s.readAsText(this), e(s);
  }), (typeof Blob.prototype.stream > "u" || !t()) && (Blob.prototype.stream = function() {
    let r = 0;
    const s = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(n) {
        const o = n.byobRequest.view, a = await s.slice(
          r,
          r + o.byteLength
        ).arrayBuffer(), l = new Uint8Array(a);
        new Uint8Array(o.buffer).set(l);
        const c = l.byteLength;
        n.byobRequest.respond(c), r += c, r >= s.size && n.close();
      }
    });
  });
}
if (currentJsRuntime$1 === "NODE" && typeof CustomEvent > "u") {
  class e extends Event {
    constructor(r, s = {}) {
      super(r, s), this.detail = s.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = e;
}
const kError = Symbol("error"), kMessage = Symbol("message");
class ErrorEvent2 extends Event {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param type The name of the event
   * @param options A dictionary object that allows for setting
   *                  attributes via object members of the same name.
   */
  constructor(t, r = {}) {
    super(t), this[kError] = r.error === void 0 ? null : r.error, this[kMessage] = r.message === void 0 ? "" : r.message;
  }
  get error() {
    return this[kError];
  }
  get message() {
    return this[kMessage];
  }
}
Object.defineProperty(ErrorEvent2.prototype, "error", { enumerable: !0 });
Object.defineProperty(ErrorEvent2.prototype, "message", { enumerable: !0 });
const ErrorEvent = typeof globalThis.ErrorEvent == "function" ? globalThis.ErrorEvent : ErrorEvent2;
function isExitCodeZero(e) {
  return e instanceof Error ? "exitCode" in e && (e == null ? void 0 : e.exitCode) === 0 || (e == null ? void 0 : e.name) === "ExitStatus" && "status" in e && e.status === 0 : !1;
}
const logToConsole = (e, ...t) => {
  switch (e.severity) {
    case "Debug":
      console.debug(e.message, ...t);
      break;
    case "Info":
      console.info(e.message, ...t);
      break;
    case "Warn":
      console.warn(e.message, ...t);
      break;
    case "Error":
      console.error(e.message, ...t);
      break;
    case "Fatal":
      console.error(e.message, ...t);
      break;
    default:
      console.log(e.message, ...t);
  }
}, prepareLogMessage = (e, ...t) => [
  typeof e == "object" ? JSON.stringify(e) : e,
  ...t.map((r) => JSON.stringify(r))
].join(" "), logs = [], addToLogArray = (e) => {
  logs.push(e);
}, logToMemory = (e) => {
  if (e.raw === !0)
    addToLogArray(e.message);
  else {
    const t = formatLogEntry(
      typeof e.message == "object" ? prepareLogMessage(e.message) : e.message,
      e.severity ?? "Info",
      e.prefix ?? "JavaScript"
    );
    addToLogArray(t);
  }
};
class Logger extends EventTarget {
  // constructor
  constructor(t = []) {
    super(), this.handlers = t, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(logToMemory) ? [...logs] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`), []);
  }
  /**
   * Log message with severity.
   *
   * @param message any
   * @param severity LogSeverity
   * @param raw boolean
   * @param args any
   */
  logMessage(t, ...r) {
    for (const s of this.handlers)
      s(t, ...r);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: void 0,
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Debug",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Info",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Warn",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(t, ...r) {
    this.logMessage(
      {
        message: t,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...r
    );
  }
}
const logger = new Logger([logToMemory, logToConsole]), formatLogEntry = (e, t, r) => {
  const s = /* @__PURE__ */ new Date(), n = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(s).replace(/ /g, "-"), o = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(s);
  return `[${n + " " + o}] ${r} ${t}: ${e}`;
};
class UnhandledRejectionsTarget extends EventTarget {
  constructor() {
    super(...arguments), this.listenersCount = 0;
  }
  addEventListener(t, r) {
    ++this.listenersCount, super.addEventListener(t, r);
  }
  removeEventListener(t, r) {
    --this.listenersCount, super.removeEventListener(t, r);
  }
  hasListeners() {
    return this.listenersCount > 0;
  }
}
function improveWASMErrorReporting(e) {
  e.asm = {
    ...e.asm
  };
  const t = new UnhandledRejectionsTarget();
  for (const r in e.asm)
    if (typeof e.asm[r] == "function") {
      const s = e.asm[r];
      e.asm[r] = function(...n) {
        var o;
        try {
          return s(...n);
        } catch (i) {
          if (!(i instanceof Error))
            throw i;
          const a = clarifyErrorMessage(
            i,
            (o = e.lastAsyncifyStackSource) == null ? void 0 : o.stack
          );
          if (e.lastAsyncifyStackSource && (i.cause = e.lastAsyncifyStackSource), t.hasListeners()) {
            t.dispatchEvent(
              new ErrorEvent("error", {
                error: i,
                message: a
              })
            );
            return;
          }
          throw isExitCodeZero(i) || showCriticalErrorBox(a), i;
        }
      };
    }
  return t;
}
let functionsMaybeMissingFromAsyncify = [];
function getFunctionsMaybeMissingFromAsyncify() {
  return functionsMaybeMissingFromAsyncify;
}
function clarifyErrorMessage(e, t) {
  if (e.message === "unreachable") {
    let r = UNREACHABLE_ERROR;
    t || (r += `

This stack trace is lacking. For a better one initialize 
the PHP runtime with { debug: true }, e.g. PHPNode.load('8.1', { debug: true }).

`), functionsMaybeMissingFromAsyncify = extractPHPFunctionsFromStack(
      t || e.stack || ""
    );
    for (const s of functionsMaybeMissingFromAsyncify)
      r += `    * ${s}
`;
    return r;
  }
  return e.message;
}
const UNREACHABLE_ERROR = `
"unreachable" WASM instruction executed.

The typical reason is a PHP function missing from the ASYNCIFY_ONLY
list when building PHP.wasm.

You will need to file a new issue in the WordPress Playground repository
and paste this error message there:

https://github.com/WordPress/wordpress-playground/issues/new

If you're a core developer, the typical fix is to:

* Isolate a minimal reproduction of the error
* Add a reproduction of the error to php-asyncify.spec.ts in the WordPress Playground repository
* Run 'npm run fix-asyncify'
* Commit the changes, push to the repo, release updated NPM packages

Below is a list of all the PHP functions found in the stack trace to
help with the minimal reproduction. If they're all already listed in
the Dockerfile, you'll need to trigger this error again with long stack
traces enabled. In node.js, you can do it using the --stack-trace-limit=100
CLI option: 

`, redBg = "\x1B[41m", bold = "\x1B[1m", reset = "\x1B[0m", eol = "\x1B[K";
let logged = !1;
function showCriticalErrorBox(e) {
  if (!logged && (logged = !0, !(e != null && e.trim().startsWith("Program terminated with exit")))) {
    logger.log(`${redBg}
${eol}
${bold}  WASM ERROR${reset}${redBg}`);
    for (const t of e.split(`
`))
      logger.log(`${eol}  ${t} `);
    logger.log(`${reset}`);
  }
}
function extractPHPFunctionsFromStack(e) {
  try {
    const t = e.split(`
`).slice(1).map((r) => {
      const s = r.trim().substring(3).split(" ");
      return {
        fn: s.length >= 2 ? s[0] : "<unknown>",
        isWasm: r.includes("wasm://")
      };
    }).filter(
      ({ fn: r, isWasm: s }) => s && !r.startsWith("dynCall_") && !r.startsWith("invoke_")
    ).map(({ fn: r }) => r);
    return Array.from(new Set(t));
  } catch {
    return [];
  }
}
const SleepFinished = Symbol("SleepFinished");
function sleep(e) {
  return new Promise((t) => {
    setTimeout(() => t(SleepFinished), e);
  });
}
class AcquireTimeoutError extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class Semaphore {
  constructor({ concurrency: t, timeout: r }) {
    this._running = 0, this.concurrency = t, this.timeout = r, this.queue = [];
  }
  get remaining() {
    return this.concurrency - this.running;
  }
  get running() {
    return this._running;
  }
  async acquire() {
    for (; ; )
      if (this._running >= this.concurrency) {
        const t = new Promise((r) => {
          this.queue.push(r);
        });
        this.timeout !== void 0 ? await Promise.race([t, sleep(this.timeout)]).then(
          (r) => {
            if (r === SleepFinished)
              throw new AcquireTimeoutError();
          }
        ) : await t;
      } else {
        this._running++;
        let t = !1;
        return () => {
          t || (t = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(t) {
    const r = await this.acquire();
    try {
      return await t();
    } finally {
      r();
    }
  }
}
class PhpWasmError extends Error {
  constructor(t, r) {
    super(t), this.userFriendlyMessage = r, this.userFriendlyMessage || (this.userFriendlyMessage = t);
  }
}
function joinPaths(...e) {
  let t = e.join("/");
  const r = t[0] === "/", s = t.substring(t.length - 1) === "/";
  return t = normalizePath(t), !t && !r && (t = "."), t && s && (t += "/"), t;
}
function normalizePath(e) {
  const t = e[0] === "/";
  return e = normalizePathsArray(
    e.split("/").filter((r) => !!r),
    !t
  ).join("/"), (t ? "/" : "") + e.replace(/\/$/, "");
}
function normalizePathsArray(e, t) {
  let r = 0;
  for (let s = e.length - 1; s >= 0; s--) {
    const n = e[s];
    n === "." ? e.splice(s, 1) : n === ".." ? (e.splice(s, 1), r++) : r && (e.splice(s, 1), r--);
  }
  if (t)
    for (; r; r--)
      e.unshift("..");
  return e;
}
function splitShellCommand(e) {
  let s = 0, n = "";
  const o = [];
  let i = "";
  for (let a = 0; a < e.length; a++) {
    const l = e[a];
    l === "\\" ? ((e[a + 1] === '"' || e[a + 1] === "'") && a++, i += e[a]) : s === 0 ? l === '"' || l === "'" ? (s = 1, n = l) : l.match(/\s/) ? (i.trim().length && o.push(i.trim()), i = l) : o.length && !i ? i = o.pop() + l : i += l : s === 1 && (l === n ? (s = 0, n = "") : i += l);
  }
  return i && o.push(i.trim()), o;
}
function createSpawnHandler(e) {
  return function(t, r = [], s = {}) {
    const n = new ChildProcess(), o = new ProcessApi(n);
    return setTimeout(async () => {
      let i = [];
      if (r.length)
        i = [t, ...r];
      else if (typeof t == "string")
        i = splitShellCommand(t);
      else if (Array.isArray(t))
        i = t;
      else
        throw new Error("Invalid command ", t);
      try {
        await e(i, o, s);
      } catch (a) {
        n.emit("error", a), typeof a == "object" && a !== null && "message" in a && typeof a.message == "string" && o.stderr(a.message), o.exit(1);
      }
      n.emit("spawn", !0);
    }), n;
  };
}
class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  emit(t, r) {
    this.listeners[t] && this.listeners[t].forEach(function(s) {
      s(r);
    });
  }
  on(t, r) {
    this.listeners[t] || (this.listeners[t] = []), this.listeners[t].push(r);
  }
}
class ProcessApi extends EventEmitter {
  constructor(t) {
    super(), this.childProcess = t, this.exited = !1, this.stdinData = [], t.on("stdin", (r) => {
      this.stdinData ? this.stdinData.push(r.slice()) : this.emit("stdin", r);
    });
  }
  stdout(t) {
    typeof t == "string" && (t = new TextEncoder().encode(t)), this.childProcess.stdout.emit("data", t);
  }
  stdoutEnd() {
    this.childProcess.stdout.emit("end", {});
  }
  stderr(t) {
    typeof t == "string" && (t = new TextEncoder().encode(t)), this.childProcess.stderr.emit("data", t);
  }
  stderrEnd() {
    this.childProcess.stderr.emit("end", {});
  }
  exit(t) {
    this.exited || (this.exited = !0, this.childProcess.emit("exit", t));
  }
  flushStdin() {
    if (this.stdinData)
      for (let t = 0; t < this.stdinData.length; t++)
        this.emit("stdin", this.stdinData[t]);
    this.stdinData = null;
  }
}
let lastPid = 9743;
class ChildProcess extends EventEmitter {
  constructor(t = lastPid++) {
    super(), this.pid = t, this.stdout = new EventEmitter(), this.stderr = new EventEmitter();
    const r = this;
    this.stdin = {
      write: (s) => {
        r.emit("stdin", s);
      }
    };
  }
}
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const e = this.getReader();
  try {
    for (; ; ) {
      const { done: t, value: r } = await e.read();
      if (t)
        return;
      yield r;
    }
  } finally {
    e.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
const responseTexts = {
  500: "Internal Server Error",
  502: "Bad Gateway",
  404: "Not Found",
  403: "Forbidden",
  401: "Unauthorized",
  400: "Bad Request",
  301: "Moved Permanently",
  302: "Found",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  204: "No Content",
  201: "Created",
  200: "OK"
};
class PHPResponse {
  constructor(t, r, s, n = "", o = 0) {
    this.httpStatusCode = t, this.headers = r, this.bytes = s, this.exitCode = o, this.errors = n;
  }
  static forHttpCode(t, r = "") {
    return new PHPResponse(
      t,
      {},
      new TextEncoder().encode(
        r || responseTexts[t] || ""
      )
    );
  }
  static fromRawData(t) {
    return new PHPResponse(
      t.httpStatusCode,
      t.headers,
      t.bytes,
      t.errors,
      t.exitCode
    );
  }
  toRawData() {
    return {
      headers: this.headers,
      bytes: this.bytes,
      errors: this.errors,
      exitCode: this.exitCode,
      httpStatusCode: this.httpStatusCode
    };
  }
  /**
   * Response body as JSON.
   */
  get json() {
    return JSON.parse(this.text);
  }
  /**
   * Response body as text.
   */
  get text() {
    return new TextDecoder().decode(this.bytes);
  }
}
const SupportedPHPVersions = [
  "8.3",
  "8.2",
  "8.1",
  "8.0",
  "7.4",
  "7.3",
  "7.2",
  "7.1",
  "7.0"
], LatestSupportedPHPVersion = SupportedPHPVersions[0], FileErrorCodes = {
  0: "No error occurred. System call completed successfully.",
  1: "Argument list too long.",
  2: "Permission denied.",
  3: "Address in use.",
  4: "Address not available.",
  5: "Address family not supported.",
  6: "Resource unavailable, or operation would block.",
  7: "Connection already in progress.",
  8: "Bad file descriptor.",
  9: "Bad message.",
  10: "Device or resource busy.",
  11: "Operation canceled.",
  12: "No child processes.",
  13: "Connection aborted.",
  14: "Connection refused.",
  15: "Connection reset.",
  16: "Resource deadlock would occur.",
  17: "Destination address required.",
  18: "Mathematics argument out of domain of function.",
  19: "Reserved.",
  20: "File exists.",
  21: "Bad address.",
  22: "File too large.",
  23: "Host is unreachable.",
  24: "Identifier removed.",
  25: "Illegal byte sequence.",
  26: "Operation in progress.",
  27: "Interrupted function.",
  28: "Invalid argument.",
  29: "I/O error.",
  30: "Socket is connected.",
  31: "There is a directory under that path.",
  32: "Too many levels of symbolic links.",
  33: "File descriptor value too large.",
  34: "Too many links.",
  35: "Message too large.",
  36: "Reserved.",
  37: "Filename too long.",
  38: "Network is down.",
  39: "Connection aborted by network.",
  40: "Network unreachable.",
  41: "Too many files open in system.",
  42: "No buffer space available.",
  43: "No such device.",
  44: "There is no such file or directory OR the parent directory does not exist.",
  45: "Executable file format error.",
  46: "No locks available.",
  47: "Reserved.",
  48: "Not enough space.",
  49: "No message of the desired type.",
  50: "Protocol not available.",
  51: "No space left on device.",
  52: "Function not supported.",
  53: "The socket is not connected.",
  54: "Not a directory or a symbolic link to a directory.",
  55: "Directory not empty.",
  56: "State not recoverable.",
  57: "Not a socket.",
  58: "Not supported, or operation not supported on socket.",
  59: "Inappropriate I/O control operation.",
  60: "No such device or address.",
  61: "Value too large to be stored in data type.",
  62: "Previous owner died.",
  63: "Operation not permitted.",
  64: "Broken pipe.",
  65: "Protocol error.",
  66: "Protocol not supported.",
  67: "Protocol wrong type for socket.",
  68: "Result too large.",
  69: "Read-only file system.",
  70: "Invalid seek.",
  71: "No such process.",
  72: "Reserved.",
  73: "Connection timed out.",
  74: "Text file busy.",
  75: "Cross-device link.",
  76: "Extension: Capabilities insufficient."
};
function getEmscriptenFsError(e) {
  const t = typeof e == "object" ? e == null ? void 0 : e.errno : null;
  if (t in FileErrorCodes)
    return FileErrorCodes[t];
}
function rethrowFileSystemError(e = "") {
  return function(r, s, n) {
    const o = n.value;
    n.value = function(...i) {
      try {
        return o.apply(this, i);
      } catch (a) {
        const l = typeof a == "object" ? a == null ? void 0 : a.errno : null;
        if (l in FileErrorCodes) {
          const c = FileErrorCodes[l], h = typeof i[0] == "string" ? i[0] : null, _ = h !== null ? e.replaceAll("{path}", h) : e;
          throw new Error(`${_}: ${c}`, {
            cause: a
          });
        }
        throw a;
      }
    };
  };
}
const RuntimeId = Symbol("RuntimeId"), loadedRuntimes = /* @__PURE__ */ new Map();
let lastRuntimeId = 0;
async function loadPHPRuntime(e, t = {}) {
  const [r, s, n] = makePromise(), o = e.init(currentJsRuntime, {
    onAbort(a) {
      n(a), logger.error(a);
    },
    ENV: {},
    // Emscripten sometimes prepends a '/' to the path, which
    // breaks vite dev mode. An identity `locateFile` function
    // fixes it.
    locateFile: (a) => a,
    ...t,
    noInitialRun: !0,
    onRuntimeInitialized() {
      t.onRuntimeInitialized && t.onRuntimeInitialized(), s();
    }
  });
  await r;
  const i = ++lastRuntimeId;
  return o.id = i, o.originalExit = o._exit, o._exit = function(a) {
    return loadedRuntimes.delete(i), o.originalExit(a);
  }, o[RuntimeId] = i, loadedRuntimes.set(i, o), i;
}
function getLoadedRuntime(e) {
  return loadedRuntimes.get(e);
}
const currentJsRuntime = function() {
  var e;
  return typeof process < "u" && ((e = process.release) == null ? void 0 : e.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
}(), makePromise = () => {
  const e = [], t = new Promise((r, s) => {
    e.push(r, s);
  });
  return e.unshift(t), e;
};
var __defProp = Object.defineProperty, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __decorateClass = (e, t, r, s) => {
  for (var n = __getOwnPropDesc(t, r) , o = e.length - 1, i; o >= 0; o--)
    (i = e[o]) && (n = (i(t, r, n) ) || n);
  return n && __defProp(t, r, n), n;
};
const STRING = "string", NUMBER = "number", __private__dont__use = Symbol("__private__dont__use");
class PHPExecutionFailureError extends Error {
  constructor(t, r, s) {
    super(t), this.response = r, this.source = s;
  }
}
var P, E, v, y, w, g, b, R, q, x, z, T, U, k, $, C, V, F, G, H, j, M, J, I, Q, N, Y, A, Z, L, K, O, X, W, ee, B, te;
class BasePHP {
  /**
   * Initializes a PHP runtime.
   *
   * @internal
   * @param  PHPRuntime - Optional. PHP Runtime ID as initialized by loadPHPRuntime.
   * @param  requestHandlerOptions - Optional. Options for the PHPRequestHandler. If undefined, no request handler will be initialized.
   */
  constructor(e) {
    /**
     * Prepares the $_SERVER entries for the PHP runtime.
     *
     * @param defaults Default entries to include in $_SERVER.
     * @param headers HTTP headers to include in $_SERVER (as HTTP_ prefixed entries).
     * @param port HTTP port, used to determine infer $_SERVER['HTTPS'] value if none
     *             was provided.
     * @returns Computed $_SERVER entries.
     */
    u(this, R);
    u(this, x);
    u(this, T);
    u(this, k);
    u(this, C);
    u(this, F);
    u(this, H);
    u(this, M);
    u(this, I);
    u(this, N);
    u(this, A);
    u(this, L);
    u(this, O);
    u(this, W);
    u(this, B);
    u(this, P, void 0);
    u(this, E, void 0);
    u(this, v, void 0);
    u(this, y, void 0);
    u(this, w, void 0);
    u(this, g, void 0);
    u(this, b, void 0);
    m(this, P, []), m(this, y, !1), m(this, w, null), m(this, g, /* @__PURE__ */ new Map()), m(this, b, []), this.semaphore = new Semaphore({ concurrency: 1 }), e !== void 0 && this.initializeRuntime(e);
  }
  addEventListener(e, t) {
    d(this, g).has(e) || d(this, g).set(e, /* @__PURE__ */ new Set()), d(this, g).get(e).add(t);
  }
  removeEventListener(e, t) {
    var r;
    (r = d(this, g).get(e)) == null || r.delete(t);
  }
  dispatchEvent(e) {
    const t = d(this, g).get(e.type);
    if (t)
      for (const r of t)
        r(e);
  }
  /** @inheritDoc */
  async onMessage(e) {
    d(this, b).push(e);
  }
  /** @inheritDoc */
  async setSpawnHandler(handler) {
    typeof handler == "string" && (handler = createSpawnHandler(eval(handler))), this[__private__dont__use].spawnProcess = handler;
  }
  /** @inheritDoc */
  get absoluteUrl() {
    return this.requestHandler.absoluteUrl;
  }
  /** @inheritDoc */
  get documentRoot() {
    return this.requestHandler.documentRoot;
  }
  /** @inheritDoc */
  pathToInternalUrl(e) {
    return this.requestHandler.pathToInternalUrl(e);
  }
  /** @inheritDoc */
  internalUrlToPath(e) {
    return this.requestHandler.internalUrlToPath(e);
  }
  initializeRuntime(e) {
    if (this[__private__dont__use])
      throw new Error("PHP runtime already initialized.");
    const t = getLoadedRuntime(e);
    if (!t)
      throw new Error("Invalid PHP runtime id.");
    this[__private__dont__use] = t, t.onMessage = async (r) => {
      for (const s of d(this, b)) {
        const n = await s(r);
        if (n)
          return n;
      }
      return "";
    }, m(this, w, improveWASMErrorReporting(t)), this.dispatchEvent({
      type: "runtime.initialized"
    });
  }
  /** @inheritDoc */
  async setSapiName(e) {
    if (this[__private__dont__use].ccall(
      "wasm_set_sapi_name",
      NUMBER,
      [STRING],
      [e]
    ) !== 0)
      throw new Error(
        "Could not set SAPI name. This can only be done before the PHP WASM module is initialized.Did you already dispatch any requests?"
      );
    m(this, v, e);
  }
  /** @inheritDoc */
  setPhpIniPath(e) {
    if (d(this, y))
      throw new Error("Cannot set PHP ini path after calling run().");
    m(this, E, e), this[__private__dont__use].ccall(
      "wasm_set_phpini_path",
      null,
      ["string"],
      [e]
    );
  }
  /** @inheritDoc */
  setPhpIniEntry(e, t) {
    if (d(this, y))
      throw new Error("Cannot set PHP ini entries after calling run().");
    d(this, P).push([e, t]);
  }
  /** @inheritDoc */
  chdir(e) {
    this[__private__dont__use].FS.chdir(e);
  }
  /**
   * Do not use. Use new PHPRequestHandler() instead.
   * @deprecated
   */
  async request(e) {
    if (logger.warn(
      "PHP.request() is deprecated. Please use new PHPRequestHandler() instead."
    ), !this.requestHandler)
      throw new Error("No request handler available.");
    return this.requestHandler.request(e);
  }
  /** @inheritDoc */
  async run(e) {
    const t = await this.semaphore.acquire();
    let r;
    try {
      if (d(this, y) || (p(this, x, z).call(this), m(this, y, !0)), e.scriptPath && !this.fileExists(e.scriptPath))
        throw new Error(
          `The script path "${e.scriptPath}" does not exist.`
        );
      p(this, A, Z).call(this, e.scriptPath || ""), p(this, k, $).call(this, e.relativeUri || ""), p(this, M, J).call(this, e.method || "GET");
      const s = normalizeHeaders(e.headers || {}), n = s.host || "example.com:443", o = p(this, H, j).call(this, n, e.protocol || "http");
      p(this, C, V).call(this, n), p(this, F, G).call(this, o), p(this, I, Q).call(this, s), e.body && (r = p(this, N, Y).call(this, e.body)), typeof e.code == "string" && p(this, W, ee).call(this, " ?>" + e.code);
      const i = p(this, R, q).call(this, e.$_SERVER, s, o);
      for (const c in i)
        p(this, L, K).call(this, c, i[c]);
      const a = e.env || {};
      for (const c in a)
        p(this, O, X).call(this, c, a[c]);
      const l = await p(this, B, te).call(this);
      if (l.exitCode !== 0) {
        logger.warn("PHP.run() output was:", l.text);
        const c = new PHPExecutionFailureError(
          `PHP.run() failed with exit code ${l.exitCode} and the following output: ` + l.errors,
          l,
          "request"
        );
        throw logger.error(c), c;
      }
      return l;
    } catch (s) {
      throw this.dispatchEvent({
        type: "request.error",
        error: s,
        // Distinguish between PHP request and PHP-wasm errors
        source: s.source ?? "php-wasm"
      }), s;
    } finally {
      try {
        r && this[__private__dont__use].free(r);
      } finally {
        t(), this.dispatchEvent({
          type: "request.end"
        });
      }
    }
  }
  defineConstant(e, t) {
    let r = {};
    try {
      r = JSON.parse(
        this.fileExists("/internal/consts.json") && this.readFileAsText("/internal/consts.json") || "{}"
      );
    } catch {
    }
    this.writeFile(
      "/internal/consts.json",
      JSON.stringify({
        ...r,
        [e]: t
      })
    );
  }
  mkdir(e) {
    this[__private__dont__use].FS.mkdirTree(e);
  }
  mkdirTree(e) {
    this.mkdir(e);
  }
  readFileAsText(e) {
    return new TextDecoder().decode(this.readFileAsBuffer(e));
  }
  readFileAsBuffer(e) {
    return this[__private__dont__use].FS.readFile(e);
  }
  writeFile(e, t) {
    this[__private__dont__use].FS.writeFile(e, t);
  }
  unlink(e) {
    this[__private__dont__use].FS.unlink(e);
  }
  /** @inheritDoc */
  mv(e, t) {
    try {
      this[__private__dont__use].FS.rename(e, t);
    } catch (r) {
      const s = getEmscriptenFsError(r);
      throw s ? new Error(
        `Could not move ${e} to ${t}: ${s}`,
        {
          cause: r
        }
      ) : r;
    }
  }
  rmdir(e, t = { recursive: !0 }) {
    t != null && t.recursive && this.listFiles(e).forEach((r) => {
      const s = `${e}/${r}`;
      this.isDir(s) ? this.rmdir(s, t) : this.unlink(s);
    }), this[__private__dont__use].FS.rmdir(e);
  }
  listFiles(e, t = { prependPath: !1 }) {
    if (!this.fileExists(e))
      return [];
    try {
      const r = this[__private__dont__use].FS.readdir(e).filter(
        (s) => s !== "." && s !== ".."
      );
      if (t.prependPath) {
        const s = e.replace(/\/$/, "");
        return r.map((n) => `${s}/${n}`);
      }
      return r;
    } catch (r) {
      return logger.error(r, { path: e }), [];
    }
  }
  isDir(e) {
    return this.fileExists(e) ? this[__private__dont__use].FS.isDir(
      this[__private__dont__use].FS.lookupPath(e).node.mode
    ) : !1;
  }
  fileExists(e) {
    try {
      return this[__private__dont__use].FS.lookupPath(e), !0;
    } catch {
      return !1;
    }
  }
  /**
   * Hot-swaps the PHP runtime for a new one without
   * interrupting the operations of this PHP instance.
   *
   * @param runtime
   * @param cwd. Internal, the VFS path to recreate in the new runtime.
   *             This arg is temporary and will be removed once BasePHP
   *             is fully decoupled from the request handler and
   *             accepts a constructor-level cwd argument.
   */
  hotSwapPHPRuntime(e, t) {
    const r = this[__private__dont__use].FS;
    try {
      this.exit();
    } catch {
    }
    this.initializeRuntime(e), d(this, E) && this.setPhpIniPath(d(this, E)), d(this, v) && this.setSapiName(d(this, v)), t && copyFS(r, this[__private__dont__use].FS, t);
  }
  exit(e = 0) {
    this.dispatchEvent({
      type: "runtime.beforedestroy"
    });
    try {
      this[__private__dont__use]._exit(e);
    } catch {
    }
    m(this, y, !1), m(this, w, null), delete this[__private__dont__use].onMessage, delete this[__private__dont__use];
  }
  [Symbol.dispose]() {
    d(this, y) && this.exit(0);
  }
}
P = new WeakMap(), E = new WeakMap(), v = new WeakMap(), y = new WeakMap(), w = new WeakMap(), g = new WeakMap(), b = new WeakMap(), R = new WeakSet(), q = function(e, t, r) {
  const s = {
    ...e || {}
  };
  s.HTTPS = s.HTTPS || r === 443 ? "on" : "off";
  for (const n in t) {
    let o = "HTTP_";
    ["content-type", "content-length"].includes(n.toLowerCase()) && (o = ""), s[`${o}${n.toUpperCase().replace(/-/g, "_")}`] = t[n];
  }
  return s;
}, x = new WeakSet(), z = function() {
  if (this.setPhpIniEntry("auto_prepend_file", "/internal/consts.php"), this.fileExists("/internal/consts.php") || this.writeFile(
    "/internal/consts.php",
    `<?php
				if(file_exists('/internal/consts.json')) {
					$consts = json_decode(file_get_contents('/internal/consts.json'), true);
					foreach ($consts as $const => $value) {
						if (!defined($const) && is_scalar($value)) {
							define($const, $value);
						}
					}
				}`
  ), d(this, P).length > 0) {
    const e = d(this, P).map(([t, r]) => `${t}=${r}`).join(`
`) + `

`;
    this[__private__dont__use].ccall(
      "wasm_set_phpini_entries",
      null,
      [STRING],
      [e]
    );
  }
  this[__private__dont__use].ccall("php_wasm_init", null, [], []);
}, T = new WeakSet(), U = function() {
  const e = "/internal/headers.json";
  if (!this.fileExists(e))
    throw new Error(
      "SAPI Error: Could not find response headers file."
    );
  const t = JSON.parse(this.readFileAsText(e)), r = {};
  for (const s of t.headers) {
    if (!s.includes(": "))
      continue;
    const n = s.indexOf(": "), o = s.substring(0, n).toLowerCase(), i = s.substring(n + 2);
    o in r || (r[o] = []), r[o].push(i);
  }
  return {
    headers: r,
    httpStatusCode: t.status
  };
}, k = new WeakSet(), $ = function(e) {
  if (this[__private__dont__use].ccall(
    "wasm_set_request_uri",
    null,
    [STRING],
    [e]
  ), e.includes("?")) {
    const t = e.substring(e.indexOf("?") + 1);
    this[__private__dont__use].ccall(
      "wasm_set_query_string",
      null,
      [STRING],
      [t]
    );
  }
}, C = new WeakSet(), V = function(e) {
  this[__private__dont__use].ccall(
    "wasm_set_request_host",
    null,
    [STRING],
    [e]
  );
}, F = new WeakSet(), G = function(e) {
  this[__private__dont__use].ccall(
    "wasm_set_request_port",
    null,
    [NUMBER],
    [e]
  );
}, H = new WeakSet(), j = function(e, t) {
  let r;
  try {
    r = parseInt(new URL(e).port, 10);
  } catch {
  }
  return (!r || isNaN(r) || r === 80) && (r = t === "https" ? 443 : 80), r;
}, M = new WeakSet(), J = function(e) {
  this[__private__dont__use].ccall(
    "wasm_set_request_method",
    null,
    [STRING],
    [e]
  );
}, I = new WeakSet(), Q = function(e) {
  e.cookie && this[__private__dont__use].ccall(
    "wasm_set_cookies",
    null,
    [STRING],
    [e.cookie]
  ), e["content-type"] && this[__private__dont__use].ccall(
    "wasm_set_content_type",
    null,
    [STRING],
    [e["content-type"]]
  ), e["content-length"] && this[__private__dont__use].ccall(
    "wasm_set_content_length",
    null,
    [NUMBER],
    [parseInt(e["content-length"], 10)]
  );
}, N = new WeakSet(), Y = function(e) {
  let t, r;
  typeof e == "string" ? (logger.warn(
    "Passing a string as the request body is deprecated. Please use a Uint8Array instead. See https://github.com/WordPress/wordpress-playground/issues/997 for more details"
  ), r = this[__private__dont__use].lengthBytesUTF8(e), t = r + 1) : (r = e.byteLength, t = e.byteLength);
  const s = this[__private__dont__use].malloc(t);
  if (!s)
    throw new Error("Could not allocate memory for the request body.");
  return typeof e == "string" ? this[__private__dont__use].stringToUTF8(
    e,
    s,
    t + 1
  ) : this[__private__dont__use].HEAPU8.set(e, s), this[__private__dont__use].ccall(
    "wasm_set_request_body",
    null,
    [NUMBER],
    [s]
  ), this[__private__dont__use].ccall(
    "wasm_set_content_length",
    null,
    [NUMBER],
    [r]
  ), s;
}, A = new WeakSet(), Z = function(e) {
  this[__private__dont__use].ccall(
    "wasm_set_path_translated",
    null,
    [STRING],
    [e]
  );
}, L = new WeakSet(), K = function(e, t) {
  this[__private__dont__use].ccall(
    "wasm_add_SERVER_entry",
    null,
    [STRING, STRING],
    [e, t]
  );
}, O = new WeakSet(), X = function(e, t) {
  this[__private__dont__use].ccall(
    "wasm_add_ENV_entry",
    null,
    [STRING, STRING],
    [e, t]
  );
}, W = new WeakSet(), ee = function(e) {
  this[__private__dont__use].ccall(
    "wasm_set_php_code",
    null,
    [STRING],
    [e]
  );
}, B = new WeakSet(), te = async function() {
  var n;
  let e, t;
  try {
    e = await new Promise((o, i) => {
      var l;
      t = (c) => {
        logger.error(c), logger.error(c.error);
        const h = new Error("Rethrown");
        h.cause = c.error, h.betterMessage = c.message, i(h);
      }, (l = d(this, w)) == null || l.addEventListener(
        "error",
        t
      );
      const a = this[__private__dont__use].ccall(
        "wasm_sapi_handle_request",
        NUMBER,
        [],
        [],
        { async: !0 }
      );
      return a instanceof Promise ? a.then(o, i) : o(a);
    });
  } catch (o) {
    for (const c in this)
      typeof this[c] == "function" && (this[c] = () => {
        throw new Error(
          "PHP runtime has crashed – see the earlier error for details."
        );
      });
    this.functionsMaybeMissingFromAsyncify = getFunctionsMaybeMissingFromAsyncify();
    const i = o, a = "betterMessage" in i ? i.betterMessage : i.message, l = new Error(a);
    throw l.cause = i, logger.error(l), l;
  } finally {
    (n = d(this, w)) == null || n.removeEventListener("error", t);
  }
  const { headers: r, httpStatusCode: s } = p(this, T, U).call(this);
  return new PHPResponse(
    e === 0 ? s : 500,
    r,
    this.readFileAsBuffer("/internal/stdout"),
    this.readFileAsText("/internal/stderr"),
    e
  );
};
__decorateClass([
  rethrowFileSystemError('Could not create directory "{path}"')
], BasePHP.prototype, "mkdir");
__decorateClass([
  rethrowFileSystemError('Could not create directory "{path}"')
], BasePHP.prototype, "mkdirTree");
__decorateClass([
  rethrowFileSystemError('Could not read "{path}"')
], BasePHP.prototype, "readFileAsText");
__decorateClass([
  rethrowFileSystemError('Could not read "{path}"')
], BasePHP.prototype, "readFileAsBuffer");
__decorateClass([
  rethrowFileSystemError('Could not write to "{path}"')
], BasePHP.prototype, "writeFile");
__decorateClass([
  rethrowFileSystemError('Could not unlink "{path}"')
], BasePHP.prototype, "unlink");
__decorateClass([
  rethrowFileSystemError('Could not remove directory "{path}"')
], BasePHP.prototype, "rmdir");
__decorateClass([
  rethrowFileSystemError('Could not list files in "{path}"')
], BasePHP.prototype, "listFiles");
__decorateClass([
  rethrowFileSystemError('Could not stat "{path}"')
], BasePHP.prototype, "isDir");
__decorateClass([
  rethrowFileSystemError('Could not stat "{path}"')
], BasePHP.prototype, "fileExists");
function normalizeHeaders(e) {
  const t = {};
  for (const r in e)
    t[r.toLowerCase()] = e[r];
  return t;
}
function copyFS(e, t, r) {
  let s;
  try {
    s = e.lookupPath(r);
  } catch {
    return;
  }
  if (!("contents" in s.node))
    return;
  if (!e.isDir(s.node.mode)) {
    t.writeFile(r, e.readFile(r));
    return;
  }
  t.mkdirTree(r);
  const n = e.readdir(r).filter((o) => o !== "." && o !== "..");
  for (const o of n)
    copyFS(e, t, joinPaths(r, o));
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const proxyMarker = Symbol("Comlink.proxy"), createEndpoint = Symbol("Comlink.endpoint"), releaseProxy = Symbol("Comlink.releaseProxy"), finalizer = Symbol("Comlink.finalizer"), throwMarker = Symbol("Comlink.thrown"), isObject = (e) => typeof e == "object" && e !== null || typeof e == "function", proxyTransferHandler = {
  canHandle: (e) => isObject(e) && e[proxyMarker],
  serialize(e) {
    const { port1: t, port2: r } = new MessageChannel();
    return expose(e, t), [r, [r]];
  },
  deserialize(e) {
    return e.start(), wrap(e);
  }
}, throwTransferHandler = {
  canHandle: (e) => isObject(e) && throwMarker in e,
  serialize({ value: e }) {
    let t;
    return e instanceof Error ? t = {
      isError: !0,
      value: {
        message: e.message,
        name: e.name,
        stack: e.stack
      }
    } : t = { isError: !1, value: e }, [t, []];
  },
  deserialize(e) {
    throw e.isError ? Object.assign(new Error(e.value.message), e.value) : e.value;
  }
}, transferHandlers = /* @__PURE__ */ new Map([
  ["proxy", proxyTransferHandler],
  ["throw", throwTransferHandler]
]);
function isAllowedOrigin(e, t) {
  for (const r of e)
    if (t === r || r === "*" || r instanceof RegExp && r.test(t))
      return !0;
  return !1;
}
function expose(e, t = globalThis, r = ["*"]) {
  t.addEventListener("message", function s(n) {
    if (!n || !n.data)
      return;
    if (!isAllowedOrigin(r, n.origin)) {
      console.warn(`Invalid origin '${n.origin}' for comlink proxy`);
      return;
    }
    const { id: o, type: i, path: a } = Object.assign({ path: [] }, n.data), l = (n.data.argumentList || []).map(fromWireValue);
    let c;
    try {
      const h = a.slice(0, -1).reduce((f, S) => f[S], e), _ = a.reduce((f, S) => f[S], e);
      switch (i) {
        case "GET":
          c = _;
          break;
        case "SET":
          h[a.slice(-1)[0]] = fromWireValue(n.data.value), c = !0;
          break;
        case "APPLY":
          c = _.apply(h, l);
          break;
        case "CONSTRUCT":
          {
            const f = new _(...l);
            c = proxy(f);
          }
          break;
        case "ENDPOINT":
          {
            const { port1: f, port2: S } = new MessageChannel();
            expose(e, S), c = transfer(f, [f]);
          }
          break;
        case "RELEASE":
          c = void 0;
          break;
        default:
          return;
      }
    } catch (h) {
      c = { value: h, [throwMarker]: 0 };
    }
    Promise.resolve(c).catch((h) => ({ value: h, [throwMarker]: 0 })).then((h) => {
      const [_, f] = toWireValue(h);
      t.postMessage(Object.assign(Object.assign({}, _), { id: o }), f), i === "RELEASE" && (t.removeEventListener("message", s), closeEndPoint(t), finalizer in e && typeof e[finalizer] == "function" && e[finalizer]());
    }).catch((h) => {
      const [_, f] = toWireValue({
        value: new TypeError("Unserializable return value"),
        [throwMarker]: 0
      });
      t.postMessage(Object.assign(Object.assign({}, _), { id: o }), f);
    });
  }), t.start && t.start();
}
function isMessagePort(e) {
  return e.constructor.name === "MessagePort";
}
function closeEndPoint(e) {
  isMessagePort(e) && e.close();
}
function wrap(e, t) {
  return createProxy(e, [], t);
}
function throwIfProxyReleased(e) {
  if (e)
    throw new Error("Proxy has been released and is not useable");
}
function releaseEndpoint(e) {
  return requestResponseMessage(e, {
    type: "RELEASE"
  }).then(() => {
    closeEndPoint(e);
  });
}
const proxyCounter = /* @__PURE__ */ new WeakMap(), proxyFinalizers = "FinalizationRegistry" in globalThis && new FinalizationRegistry((e) => {
  const t = (proxyCounter.get(e) || 0) - 1;
  proxyCounter.set(e, t), t === 0 && releaseEndpoint(e);
});
function registerProxy(e, t) {
  const r = (proxyCounter.get(t) || 0) + 1;
  proxyCounter.set(t, r), proxyFinalizers && proxyFinalizers.register(e, t, e);
}
function unregisterProxy(e) {
  proxyFinalizers && proxyFinalizers.unregister(e);
}
function createProxy(e, t = [], r = function() {
}) {
  let s = !1;
  const n = new Proxy(r, {
    get(o, i) {
      if (throwIfProxyReleased(s), i === releaseProxy)
        return () => {
          unregisterProxy(n), releaseEndpoint(e), s = !0;
        };
      if (i === "then") {
        if (t.length === 0)
          return { then: () => n };
        const a = requestResponseMessage(e, {
          type: "GET",
          path: t.map((l) => l.toString())
        }).then(fromWireValue);
        return a.then.bind(a);
      }
      return createProxy(e, [...t, i]);
    },
    set(o, i, a) {
      throwIfProxyReleased(s);
      const [l, c] = toWireValue(a);
      return requestResponseMessage(e, {
        type: "SET",
        path: [...t, i].map((h) => h.toString()),
        value: l
      }, c).then(fromWireValue);
    },
    apply(o, i, a) {
      throwIfProxyReleased(s);
      const l = t[t.length - 1];
      if (l === createEndpoint)
        return requestResponseMessage(e, {
          type: "ENDPOINT"
        }).then(fromWireValue);
      if (l === "bind")
        return createProxy(e, t.slice(0, -1));
      const [c, h] = processArguments(a);
      return requestResponseMessage(e, {
        type: "APPLY",
        path: t.map((_) => _.toString()),
        argumentList: c
      }, h).then(fromWireValue);
    },
    construct(o, i) {
      throwIfProxyReleased(s);
      const [a, l] = processArguments(i);
      return requestResponseMessage(e, {
        type: "CONSTRUCT",
        path: t.map((c) => c.toString()),
        argumentList: a
      }, l).then(fromWireValue);
    }
  });
  return registerProxy(n, e), n;
}
function myFlat(e) {
  return Array.prototype.concat.apply([], e);
}
function processArguments(e) {
  const t = e.map(toWireValue);
  return [t.map((r) => r[0]), myFlat(t.map((r) => r[1]))];
}
const transferCache = /* @__PURE__ */ new WeakMap();
function transfer(e, t) {
  return transferCache.set(e, t), e;
}
function proxy(e) {
  return Object.assign(e, { [proxyMarker]: !0 });
}
function windowEndpoint(e, t = globalThis, r = "*") {
  return {
    postMessage: (s, n) => e.postMessage(s, r, n),
    addEventListener: t.addEventListener.bind(t),
    removeEventListener: t.removeEventListener.bind(t)
  };
}
function toWireValue(e) {
  for (const [t, r] of transferHandlers)
    if (r.canHandle(e)) {
      const [s, n] = r.serialize(e);
      return [
        {
          type: "HANDLER",
          name: t,
          value: s
        },
        n
      ];
    }
  return [
    {
      type: "RAW",
      value: e
    },
    transferCache.get(e) || []
  ];
}
function fromWireValue(e) {
  switch (e.type) {
    case "HANDLER":
      return transferHandlers.get(e.name).deserialize(e.value);
    case "RAW":
      return e.value;
  }
}
function requestResponseMessage(e, t, r) {
  return new Promise((s) => {
    const n = generateUUID();
    e.addEventListener("message", function o(i) {
      !i.data || !i.data.id || i.data.id !== n || (e.removeEventListener("message", o), s(i.data));
    }), e.start && e.start(), e.postMessage(Object.assign({ id: n }, t), r);
  });
}
function generateUUID() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}
function consumeAPI(e, t = void 0) {
  setupTransferHandlers();
  const r = e instanceof Worker ? e : windowEndpoint(e, t), s = wrap(r), n = proxyClone(s);
  return new Proxy(n, {
    get: (o, i) => i === "isConnected" ? async () => {
      for (; ; )
        try {
          await runWithTimeout(s.isConnected(), 200);
          break;
        } catch {
        }
    } : s[i]
  });
}
async function runWithTimeout(e, t) {
  return new Promise((r, s) => {
    setTimeout(s, t), e.then(r);
  });
}
function exposeAPI(e, t) {
  setupTransferHandlers();
  const r = Promise.resolve();
  let s, n;
  const o = new Promise((l, c) => {
    s = l, n = c;
  }), i = proxyClone(e), a = new Proxy(i, {
    get: (l, c) => c === "isConnected" ? () => r : c === "isReady" ? () => o : c in l ? l[c] : t == null ? void 0 : t[c]
  });
  return expose(
    a,
    typeof window < "u" ? windowEndpoint(self.parent) : void 0
  ), [s, n, a];
}
let isTransferHandlersSetup = !1;
function setupTransferHandlers() {
  if (isTransferHandlersSetup)
    return;
  isTransferHandlersSetup = !0, transferHandlers.set("EVENT", {
    canHandle: (r) => r instanceof CustomEvent,
    serialize: (r) => [
      {
        detail: r.detail
      },
      []
    ],
    deserialize: (r) => r
  }), transferHandlers.set("FUNCTION", {
    canHandle: (r) => typeof r == "function",
    serialize(r) {
      logger.debug("[Comlink][Performance] Proxying a function");
      const { port1: s, port2: n } = new MessageChannel();
      return expose(r, s), [n, [n]];
    },
    deserialize(r) {
      return r.start(), wrap(r);
    }
  }), transferHandlers.set("PHPResponse", {
    canHandle: (r) => typeof r == "object" && r !== null && "headers" in r && "bytes" in r && "errors" in r && "exitCode" in r && "httpStatusCode" in r,
    serialize(r) {
      return [r.toRawData(), []];
    },
    deserialize(r) {
      return PHPResponse.fromRawData(r);
    }
  });
  const e = transferHandlers.get("throw"), t = e == null ? void 0 : e.serialize;
  e.serialize = ({ value: r }) => {
    const s = t({ value: r });
    return r.response && (s[0].value.response = r.response), r.source && (s[0].value.source = r.source), s;
  };
}
function proxyClone(e) {
  return new Proxy(e, {
    get(t, r) {
      switch (typeof t[r]) {
        case "function":
          return (...s) => t[r](...s);
        case "object":
          return t[r] === null ? t[r] : proxyClone(t[r]);
        case "undefined":
        case "number":
        case "string":
          return t[r];
        default:
          return proxy(t[r]);
      }
    }
  });
}
async function getPHPLoaderModule(e = LatestSupportedPHPVersion, t = "light") {
  if (t === "kitchen-sink")
    switch (e) {
      case "8.3":
        return await import('./php_8_3-BaS8ixKS.js');
      case "8.2":
        return await import('./php_8_2-BJZDDTr3.js');
      case "8.1":
        return await import('./php_8_1-BRFzcfrX.js');
      case "8.0":
        return await import('./php_8_0-CpIHYA6Q.js');
      case "7.4":
        return await import('./php_7_4-CFtsuoWS.js');
      case "7.3":
        return await import('./php_7_3-5tJ_745b.js');
      case "7.2":
        return await import('./php_7_2-DDj6gipw.js');
      case "7.1":
        return await import('./php_7_1-Bi6jZCCU.js');
      case "7.0":
        return await import('./php_7_0-BCgtxH-k.js');
    }
  else
    switch (e) {
      case "8.3":
        return await import('./php_8_3-36mKQoFz.js');
      case "8.2":
        return await import('./php_8_2-CwDEUCLS.js');
      case "8.1":
        return await import('./php_8_1-DVoz9hfN.js');
      case "8.0":
        return await import('./php_8_0-WykHad7g.js');
      case "7.4":
        return await import('./php_7_4-o_L-LpOE.js');
      case "7.3":
        return await import('./php_7_3-BI1zLDSY.js');
      case "7.2":
        return await import('./php_7_2-BBe4NGCd.js');
      case "7.1":
        return await import('./php_7_1-CbJWGLeL.js');
      case "7.0":
        return await import('./php_7_0-CIM2eDyA.js');
    }
  throw new Error(`Unsupported PHP version ${e}`);
}
const fakeWebsocket = () => ({
  websocket: {
    decorator: (e) => class extends e {
      constructor() {
        try {
          super();
        } catch {
        }
      }
      send() {
        return null;
      }
    }
  }
});
class WebPHP extends BasePHP {
  /**
   * Creates a new PHP instance.
   *
   * Dynamically imports the PHP module, initializes the runtime,
   * and sets up networking. It's a shorthand for the lower-level
   * functions like `getPHPLoaderModule`, `loadPHPRuntime`, and
   * `PHP.initializeRuntime`
   *
   * @param phpVersion The PHP Version to load
   * @param options The options to use when loading PHP
   * @returns A new PHP instance
   */
  static async load(t, r = {}) {
    return new WebPHP(await WebPHP.loadRuntime(t, r));
  }
  static async loadRuntime(t, r = {}) {
    var o;
    const s = r.loadAllExtensions ? "kitchen-sink" : "light", n = await getPHPLoaderModule(t, s);
    return (o = r.onPhpLoaderModuleLoaded) == null || o.call(r, n), await loadPHPRuntime(n, {
      ...r.emscriptenOptions || {},
      ...fakeWebsocket()
    });
  }
}
const _private = /* @__PURE__ */ new WeakMap();
class WebPHPEndpoint {
  /** @inheritDoc */
  constructor(t, r) {
    _private.set(this, {
      monitor: r,
      requestHandler: t
    }), this.absoluteUrl = t.absoluteUrl, this.documentRoot = t.documentRoot;
  }
  /**
   * @internal
   * @deprecated
   * Do not use this method directly in the code consuming
   * the web API. It will change or even be removed without
   * a warning.
   */
  __internal_getPHP() {
    return _private.get(this).php;
  }
  async setPrimaryPHP(t) {
    _private.set(this, {
      ..._private.get(this),
      php: t
    });
  }
  /** @inheritDoc @php-wasm/universal!PHPRequestHandler.pathToInternalUrl  */
  pathToInternalUrl(t) {
    return _private.get(this).requestHandler.pathToInternalUrl(t);
  }
  /** @inheritDoc @php-wasm/universal!PHPRequestHandler.internalUrlToPath  */
  internalUrlToPath(t) {
    return _private.get(this).requestHandler.internalUrlToPath(t);
  }
  /**
   * The onDownloadProgress event listener.
   */
  async onDownloadProgress(t) {
    var r;
    return (r = _private.get(this).monitor) == null ? void 0 : r.addEventListener("progress", t);
  }
  /** @inheritDoc @php-wasm/universal!IsomorphicLocalPHP.mv  */
  async mv(t, r) {
    return _private.get(this).php.mv(t, r);
  }
  /** @inheritDoc @php-wasm/universal!IsomorphicLocalPHP.rmdir  */
  async rmdir(t, r) {
    return _private.get(this).php.rmdir(t, r);
  }
  /** @inheritDoc @php-wasm/universal!PHPRequestHandler.request */
  async request(t) {
    return await _private.get(this).requestHandler.request(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.run */
  async run(t) {
    const { php: r, reap: s } = await _private.get(this).requestHandler.processManager.acquirePHPInstance();
    try {
      return await r.run(t);
    } finally {
      s();
    }
  }
  /** @inheritDoc @php-wasm/web!WebPHP.chdir */
  chdir(t) {
    return _private.get(this).php.chdir(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.setSapiName */
  setSapiName(t) {
    _private.get(this).php.setSapiName(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.setPhpIniPath */
  setPhpIniPath(t) {
    return _private.get(this).php.setPhpIniPath(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.setPhpIniEntry */
  setPhpIniEntry(t, r) {
    return _private.get(this).php.setPhpIniEntry(t, r);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.mkdir */
  mkdir(t) {
    return _private.get(this).php.mkdir(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.mkdirTree */
  mkdirTree(t) {
    return _private.get(this).php.mkdirTree(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.readFileAsText */
  readFileAsText(t) {
    return _private.get(this).php.readFileAsText(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.readFileAsBuffer */
  readFileAsBuffer(t) {
    return _private.get(this).php.readFileAsBuffer(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.writeFile */
  writeFile(t, r) {
    return _private.get(this).php.writeFile(t, r);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.unlink */
  unlink(t) {
    return _private.get(this).php.unlink(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.listFiles */
  listFiles(t, r) {
    return _private.get(this).php.listFiles(t, r);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.isDir */
  isDir(t) {
    return _private.get(this).php.isDir(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.fileExists */
  fileExists(t) {
    return _private.get(this).php.fileExists(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.onMessage */
  onMessage(t) {
    _private.get(this).php.onMessage(t);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.defineConstant */
  defineConstant(t, r) {
    _private.get(this).php.defineConstant(t, r);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.addEventListener */
  addEventListener(t, r) {
    _private.get(this).php.addEventListener(t, r);
  }
  /** @inheritDoc @php-wasm/web!WebPHP.removeEventListener */
  removeEventListener(t, r) {
    _private.get(this).php.removeEventListener(t, r);
  }
}
function responseTo(e, t) {
  return {
    type: "response",
    requestId: e,
    response: t
  };
}
async function registerServiceWorker(e, t, r) {
  const s = navigator.serviceWorker;
  if (!s)
    throw window.isSecureContext ? new PhpWasmError(
      "Service workers are not supported in your browser."
    ) : new PhpWasmError(
      "WordPress Playground uses service workers and may only work on HTTPS and http://localhost/ sites, but the current site is neither."
    );
  logger.debug("[window][sw] Registering a Service Worker"), await (await s.register(r, {
    type: "module",
    // Always bypass HTTP cache when fetching the new Service Worker script:
    updateViaCache: "none"
  })).update(), navigator.serviceWorker.addEventListener(
    "message",
    async function(i) {
      if (t && i.data.scope !== t)
        return;
      const a = i.data.args || [], l = i.data.method, c = await e[l](...a);
      i.source.postMessage(responseTo(i.data.requestId, c));
    }
  ), s.startMessages();
}
async function spawnPHPWorkerThread(e, t = {}) {
  e = addQueryParams(e, t);
  const r = new Worker(e, { type: "module" });
  return new Promise((s, n) => {
    r.onerror = (i) => {
      const a = new Error(
        `WebWorker failed to load at ${e}. ${i.message ? `Original error: ${i.message}` : ""}`
      );
      a.filename = i.filename, n(a);
    };
    function o(i) {
      i.data === "worker-script-started" && (s(r), r.removeEventListener("message", o));
    }
    r.addEventListener("message", o);
  });
}
function addQueryParams(e, t) {
  if (!Object.entries(t).length)
    return e + "";
  const r = new URL(e);
  for (const [s, n] of Object.entries(t))
    if (Array.isArray(n))
      for (const o of n)
        r.searchParams.append(s, o);
    else
      r.searchParams.set(s, n);
  return r.toString();
}

export { WebPHP, WebPHPEndpoint, consumeAPI, exposeAPI, getPHPLoaderModule, registerServiceWorker, spawnPHPWorkerThread };
