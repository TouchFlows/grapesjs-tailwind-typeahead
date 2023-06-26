import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import path from "path"
import pkg from "./package.json" assert { type: "json" }

/** @type {import('vite').UserConfig} */
export default defineConfig({
	plugins: [
		dts({
			outputDir: "dist/types"
		}),
	],
	build: {
		outDir: "dist",
		manifest: false,
		minify: true,
		reportCompressedSize: true,
		//commonjsOptions: { include: [] },
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: pkg.name,
			fileName: (format) => {
				switch (format) {
					case "cjs":
						return `${pkg.name}.cjs`
					case "umd":
						return `${pkg.name}.umd.js`
					default:
						return `${pkg.name}.mjs`
				}
			},
			formats: ["es", "cjs", "umd"]
		},
		rollupOptions: {
			// @ts-ignore
			output: {
				// @ts-ignore
				assetFileNames: (assetInfo) => {
					if (assetInfo.name == "style.css") return `${pkg.name}.min.css`
					return assetInfo.name
				}
			}
		}
	}
})
