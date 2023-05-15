import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

//import typescript from "@rollup/plugin-typescript";
import path from "path";
//import { typescriptPaths } from "rollup-plugin-typescript-paths";

export default defineConfig({
  //plugins: [],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 3000,
  },

  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: 'grapesjs-tailwind-typeahead',
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'style.css')
            return 'grapesjs-tailwind-typeahead.css';
          return assetInfo.name;
        },
      },
      external: [],
      /*plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          outDir: 'dist',
        }),
      ],    */  
    },
  },
  plugins: [dts({
    outputDir: 'dist/types'
  })],
  
});