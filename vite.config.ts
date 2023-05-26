import { defineConfig } from "vite"
import dts from 'vite-plugin-dts'
import path from "path"
import pkg from './package.json' assert  { type: 'json' };
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    outDir: 'dist',
    manifest: false,
    minify: true,
    reportCompressedSize: true,
    //commonjsOptions: { include: [] },
    lib: {      
      entry: path.resolve(__dirname, "src/index.ts"),
      name: pkg.name,
      fileName: (format) => `${pkg.name}.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    optimizeDeps: {
      disabled: false,
    },    
    rollupOptions: {
      // @ts-ignore
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'style.css')
            return `${pkg.name}.min.css`;
          return assetInfo.name;
        },
        inlineDynamicImports: true,
      },
      plugins: [
        commonjs(),
        nodeResolve({browser: true})
      ]
    },
  },
  plugins: [
    dts({
      outputDir: 'dist/types'
    }),
  ],
  
})