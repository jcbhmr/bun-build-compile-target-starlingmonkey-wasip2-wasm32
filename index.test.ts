import { expect, test } from "bun:test"
import { temporaryFile, temporaryFileTask, temporaryWrite, temporaryWriteTask } from "tempy"
import bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32 from "./index.ts"
import { $ } from "bun"
import { rm } from "node:fs/promises"
import { rmSync } from "node:fs"

const wasmtimeAllowAll = [
    "--dir=/",
    "-Scli=y",
    "-Scli-exit-with-code=y",
    "-Snn=y",
    "-Shttp=y",
    "-Sconfig=y",
    '-Skeyvalue=y',
    "-Stls=y",
    '-Spreview2=y',
    "-Sinherit-network=y",
    "-Sallow-ip-name-lookup=y",
    '-Stcp=y',
    '-Sudp=y',
    '-Snetwork-error-code=y',
    '-Sinherit-env=y',
]

function temporaryFileResource(...args: Parameters<typeof temporaryFile>): AsyncDisposable & { path: string } {
    const temporaryPath = temporaryFile(...args)
    return {
        path: temporaryPath,
        async [Symbol.asyncDispose]() {
            await rm(temporaryPath)
        }
    }
}

async function temporaryWriteResource(...args: Parameters<typeof temporaryWrite>): Promise<AsyncDisposable & { path: string }> {
    const temporaryPath = await temporaryWrite(...args)
    return {
        path: temporaryPath,
        async [Symbol.asyncDispose]() {
            await rm(temporaryPath)
        },
    }
}

test("console.log()", async () => {
    await using entryPoint = await temporaryWriteResource(`export function run() {
    console.log("Hello, World!");
}
`, { extension: "ts" })
    await using wit = await temporaryWriteResource(`package component:root;
world root {
    export run: func();
}
`, { extension: "wit" })
    await using out = temporaryFileResource({ extension: "wasm" })
    console.debug("Compiling to WASM...")
    await bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32({
        entrypoints: [entryPoint.path],
        compile: {
            outfile: out.path,
            starlingmonkey: {
                witPath: wit.path,
            }
        }
    })
    console.debug("Running WASM with wasmtime...")
    const output = await $`wasmtime ${wasmtimeAllowAll} --invoke ${`run()`} ${out.path}`.text()
    expect(output.trim().replace(/\r?\n\(\)$/, "")).toBe("Hello, World!")
}, { timeout: 60_000 })