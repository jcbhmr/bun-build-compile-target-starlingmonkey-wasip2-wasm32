#!/usr/bin/env bun
import { parseArgs } from "node:util";
import bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32 from ".";

const { positionals, values } = parseArgs({
    options: {
        
    },
    allowPositionals: true,
})

await bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32({
    entrypoints: positionals,
})