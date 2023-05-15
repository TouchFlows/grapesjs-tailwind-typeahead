import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'
import path from "path";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    outDir: 'dist',
    manifest: false,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'grapesjsTailwindTypeahead',
      fileName: (format) => `${format}/index.js`,
      formats: ["es", "cjs", "umd"],
    },
    
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'style.css')
            return 'grapesjs-tailwind-typeahead.css';
          return assetInfo.name;
        },
      },
    },
  },
  plugins: [
    dts({
      outputDir: 'dist/types'
    }),
  ],
  
});