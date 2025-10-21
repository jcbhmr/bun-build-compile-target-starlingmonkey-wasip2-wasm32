# `bun build --compile` for StarlingMonkey

## Installation

TODO

```sh
bun add @jcbhmr/bun-build-compile-target-starlingmonkey-wasip2-wasm32
```

## Usage

TODO

```sh
bunx bun-build-compile-target-starlingmonkey-wasip2-wasm32 \
    ./index.ts \
    --starlingmonkey-wit ./wit/ \
    --outfile ./app.wasm
```

```ts
const output = await bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32({
    entrypoints: ['./index.ts'],
    compile: {
        starlingmonkey: {
            witPath: './wit/',
        },
        outfile: './app.wasm',
    },
});
```

## Development

TODO