import {
    $,
    build,
    file,
    fileURLToPath,
    type BuildOutput,
    type CompileBuildConfig,
    type CompileBuildOptions,
    type NormalBuildConfig,
    type PathLike,
} from "bun";
import { temporaryWriteTask } from "tempy";
import { basename } from "node:path";
import process from "node:process";

type Config = Omit<
    CompileBuildConfig,
    "compile" | "bytecode"
    | "external"
    | "target"
    | "format"
    | "packages"
    | "publicPath"
    | "splitting"
    | "outdir"
> & {
    compile?:
    | "starlingmonkey-wasip2-wasm32"
    | (Omit<CompileBuildOptions, "target" | "windows"> & {
        target?: "starlingmonkey-wasip2-wasm32" | undefined;
        starlingmonkey?: {
            witPath?: string;
            witWorld?: string;
        };
    })
    | undefined;
    bytecode?: false | undefined;
    external?: [] | undefined;
    target?: "browser" | undefined;
    format?: "esm" | undefined;
    packages?: "bundle" | undefined;
    publicPath?: undefined;
    splitting?: false | undefined;
    outdir?: undefined;
};

type Output = BuildOutput;

export default async function bunBuildCompileTargetStarlingMonkeyWasiP2Wasm32(
    options: Config,
): Promise<Output> {
    try {
        const bundleBuildConfig = {
            bytecode: false,
            external: [],
            target: "browser",
            format: "esm",
            packages: "bundle",
            publicPath: undefined,
            splitting: false,
            outdir: undefined,
            throw: true,
            entrypoints: options.entrypoints,
            banner: options.banner,
            conditions: [options.conditions ?? []].flat().concat("starlingmonkey"),
            define: options.define,
            drop: options.drop,
            emitDCEAnnotations: options.emitDCEAnnotations,
            env: options.env,
            footer: options.footer,
            ignoreDCEAnnotations: options.ignoreDCEAnnotations,
            jsx: options.jsx,
            loader: options.loader,
            minify: options.minify,
            naming: options.naming,
            plugins: options.plugins,
            root: options.root,
            sourcemap: options.sourcemap,
            tsconfig: options.tsconfig,
        } satisfies NormalBuildConfig;
        const bundleBuildOutput = await build(bundleBuildConfig);
        const entryPoint = bundleBuildOutput.outputs.find(
            (output) => output.kind === "entry-point",
        );
        if (entryPoint == null) {
            throw new Error("No entry point found in bundle Bun.build() output.");
        }

        const witPath = typeof options.compile === "string" ? null : options.compile?.starlingmonkey?.witPath;
        const witWorld = typeof options.compile === "string" ? null : options.compile?.starlingmonkey?.witWorld;
        const outFilePath = (() => {
            if (typeof options.compile !== "string") {
                if (options.compile?.outfile != null) {
                    return options.compile.outfile.replace(/\.wasm$/, "") + ".wasm";
                }
            }
            return basename(entryPoint.path).replace(/\.[cm]?[jt]sx?$/, "") + ".wasm";
        })();
        const componentizeEntryPointToOutFilePath = async (witPath: string) =>
            await temporaryWriteTask(
                await entryPoint.text(),
                async (temporaryPath) => {
                    await $`${fileURLToPath(new URL("./bin/node" + (process.platform === "win32" ? ".exe" : ""), import.meta.resolve("node/package.json")))} ${fileURLToPath(new URL("./cli.js", import.meta.resolve("@bytecodealliance/componentize-js")))} ${temporaryPath} --wit ${witPath} ${witWorld != null ? ["--world-name", witWorld] : []} --out ${outFilePath}`;
                },
            );
        if (witPath != null) {
            await componentizeEntryPointToOutFilePath(witPath);
        } else {
            await temporaryWriteTask(
                "package component:root; world root {}",
                async (temporaryPath) => {
                    await componentizeEntryPointToOutFilePath(temporaryPath);
                },
            );
        }
        return {
            success: true,
            logs: [],
            outputs: [
                Object.assign(file(outFilePath), {
                    path: outFilePath,
                    loader: "file",
                    hash: null,
                    kind: "entry-point",
                    sourcemap: null,
                } as const),
            ]
        }
    } catch (error) {
        if (options.throw ?? true) {
            throw error;
        } else {
            return {
                success: false,
                logs: [
                    {
                        level: "error",
                        message: `Build failed: ${error}`,
                        name: "BuildMessage",
                        position: null,
                    } satisfies BuildMessage,
                ],
                outputs: [],
            };
        }
    }
}
