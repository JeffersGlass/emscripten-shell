import commonjs from '@rollup/plugin-commonjs'
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import postcss from 'rollup-plugin-postcss'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'

export default {
    input: "src/pyxtermplugin.ts",
    output: [
        {
            file: "build/pyxterm.js",
            format: "module",
            sourcemap: true,
            inlineDynamicImports: true,
            name: "pyxterm"
        },
        {
            file: "build/pyxterm.min.js",
            format: "module",
            sourcemap: true,
            inlineDynamicImports: true,
            name: "pyxterm",
            plugins: [terser()],
          },
    ],
    plugins: [
        string({
            include: "./src/*.py"
        }),
        commonjs(),
        typescript(),    {
      file: "build/pyscript.min.js",
      format: "iife",
      sourcemap: true,
      inlineDynamicImports: true,
      name: "pyscript",
      plugins: [terser()],
    },
        nodeResolve({
            browser: false,
            preferBuiltins: true
        }),
        postcss({
            extensions: ['.css' ],
        }),
        nodePolyfills({
            process: true
        }),
    ],
    onwarn (warning, warn) {
        //suppress "don't use eval" rollup warning
        if (warning.code === 'EVAL' ) return
    }
}