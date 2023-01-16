import commonjs from '@rollup/plugin-commonjs'
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import css from "rollup-plugin-css-only"


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
        commonjs(),
        typescript(),
        nodeResolve({
            browser: false
        }),
        css({
            include: "./node_modules/xterm/css/xterm.css",
            output: "pyxterm.css"
        })
    ],
}