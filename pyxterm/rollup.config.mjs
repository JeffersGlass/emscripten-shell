import commonjs from '@rollup/plugin-commonjs'
import typescript from "@rollup/plugin-typescript"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import postcss from 'rollup-plugin-postcss'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { string } from 'rollup-plugin-string'
import { terser } from 'rollup-plugin-terser'

const plugin_output = [
    {
        file: "build/pyxtermPlugin.js",
        format: "module",
        sourcemap: true,
        inlineDynamicImports: true,
        name: "pyxtermPlugin"
    },
]

const element_output = [
    {
        file: "build/pyxtermElement.js",
        format: "module",
        sourcemap: true,
        inlineDynamicImports: true,
        name: "pyxtermElement"
    },
]

if (!process.env.ROLLUP_WATCH){
    plugin_output.push({
        file: "build/pyxterm.min.js",
        format: "module",
        sourcemap: true,
        inlineDynamicImports: true,
        name: "pyxterm",
        plugins: [terser()],
      })
}

const shared_config = {
    
}

export default [
    {
        input: "src/pyxtermplugin.ts",
        output: plugin_output,
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
    }, 
    ///// element
    {
        input: "src/pyXtermElement.ts",
        output: element_output,
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
        name: "pyscriptXtermElement",
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
]