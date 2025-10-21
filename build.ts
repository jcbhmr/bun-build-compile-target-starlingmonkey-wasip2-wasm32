#!/usr/bin/env bun
import dts from "bun-plugin-dts";

await Bun.build({
    entrypoints: ["./main.ts", "./index.ts"],
    target: "bun",
    outdir: "dist",
    packages: "external",
    splitting: true,
    plugins: [dts()]
})