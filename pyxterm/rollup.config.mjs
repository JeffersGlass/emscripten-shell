import typescript from "@rollup/plugin-typescript"

export default {
    input: "src/main.ts",
    output: [
        {
            file: "build/pyxterm.js",
            format: "iife",
            sourcemap: true,
            inlineDynamicImports: true,
            name: "pyxterm"
        }
    ],
    plugins: [
        typescript(),
    ],
}