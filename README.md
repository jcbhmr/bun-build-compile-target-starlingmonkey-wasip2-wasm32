# `bun build --compile` for StarlingMonkey

<table align=center><td>

```sh
bunx bun-build-compile-target-starlingmonkey-wasip2-wasm32 \
    ./index.ts \
    --starlingmonkey-wit-path ./package.wit \
    --outfile ./app.wasm
```

</table>

⚛️ Embeds JavaScript code into [StarlingMonkey](https://github.com/bytecodealliance/StarlingMonkey) WebAssembly component \
📦 Bundles everything using [`Bun.build()`/`bun build`](https://bun.com/docs/bundler/executables) \
🔌 Designed to extend the [`Bun.build()`/`bun build`](https://bun.com/docs/bundler/executables) that you're used to

## Installation

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=Bun&logoColor=FFFFFF)

You can install this package from [npm](https://www.npmjs.com/) using [Bun](https://bun.sh/).

```sh
bun add @jcbhmr/bun-build-compile-target-starlingmonkey-wasip2-wasm32
```

> [!WARNING]
> This package only works with Bun. It does not work with Node.js, Deno, or the browser.

## Usage

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=Bun&logoColor=FFFFFF)

Similar to [`Bun.build()`/`bun build`](https://bun.com/docs/bundler/executables), you can use this package either via CLI or programmatically as a library. The recommended way is to start with the CLI in your [`package.json` `scripts` section](https://bun.com/docs/runtime#run-a-package-json-script) and later use the library via `bun ./build.ts` if you need plugins or other dynamic functionality.

### CLI

<div><code>package.wit</code></div>

```wit
package octocat:hello-world@0.1.0;
interface greetings {
    greeting-for: func(name: string) -> string;
}
world hello-world {
    export greetings;
}
```

<div><code>index.ts</code></div>

```ts
export const greetings = {
    greetingFor(name: string): string {
        return `Hi ${name}! How are you today?`;
    },
}
```

```sh
bunx bun-build-compile-target-starlingmonkey-wasip2-wasm32 \
    ./index.ts \
    --starlingmonkey-wit-path ./package.wit \
    --outfile ./app.wasm
```

<table><td>

```sh
wasmtime --invoke 'greeting-for("Alan Turing")' ./app.wasm
```

```
"Hi Alan Turing! How are you today?"
```

</table>

### Library

```ts
const output = await bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32({
    entrypoints: ['./index.ts'],
    compile: {
        starlingmonkey: {
            witPath: './package.wit',
        },
        outfile: './app.wasm',
    },
});
```

## Development

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=Bun&logoColor=FFFFFF)

TODO
