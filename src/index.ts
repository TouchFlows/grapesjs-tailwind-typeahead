import type { Editor, Plugin } from "grapesjs"
import './grapesjs-tailwind-typeahead.css'
import loadCommands from "./commands"
import loadTailwind from "./tailwind"
import devices from "./devices"
import en from "./locale/en"

const plugin: Plugin = (editor: Editor, opts: any = {}) => {
	const options = {
		...{
			i18n: {},
			// default options
			tailwindPlayCdn: "https://cdn.tailwindcss.com", // "https://cdn.buzzcasting.net/storage/tailwindcss/3.3.1.js"
			plugins: [],
			devices: devices,
			suggestions: {
				limit: 12
			}
		},
		...opts
	}

	editor.I18n &&
		editor.I18n.addMessages({
			en,
			...options.i18n
		})

	if (!!options.config) {
		// @ts-ignore
		editor.getModel().set("tailwind-config", options.config)
	} else 
	// @ts-ignore
	if (editor.getModel().get("tailwind-config") === undefined) {
		// @ts-ignore
		editor.getModel().set("tailwind-config", {
			content: [],
			theme: {
				extend: {}
			},
			plugins: []
		})
	}
	if (!!options.directives) {
		// @ts-ignore
		editor.getModel().set("tailwind-directives", options.directives)
	} else 
	// @ts-ignore
	if (editor.getModel().get("tailwind-directives") === undefined) {
		// @ts-ignore
		editor.getModel().set(
			"tailwind-directives",
			'@tailwind base;\n@tailwind components;\n@tailwind utilities;'
		)
	}

	// Add TailwindCSS
	loadTailwind(editor, options)
	// Add commands
	loadCommands(editor, options)
}

export default plugin
