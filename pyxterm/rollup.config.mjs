import commonjs from '@rollup/plugin-commonjs'
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import postcss from 'rollup-plugin-postcss'

export default {
    input: "src/pyxtermplugin.ts",
    output: [
        {
            file: "build/pyxterm.js",
            format: "module",
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
        postcss({
            extensions: ['.css' ],
        })
    ],
}