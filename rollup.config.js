import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            // extract CSS into a separate file (recommended)
            css: css => {
                css.write('public/build/bundle.css');
            }
        }),

        // resolve modules from node_modules
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // postcss for handling CSS
        postcss({
            extract: true,
            minimize: production
        }),

        // terser for minification in production
        production && terser(),

        // livereload for development
        !production && livereload('public'),

        // serve for development
        !production && serve({
            contentBase: 'public',
            historyApiFallback: true,
            port: 5000
        })
    ],
    watch: {
        clearScreen: false
    }
};