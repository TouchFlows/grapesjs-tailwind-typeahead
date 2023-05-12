import loadCommands from "./commands"
import loadTailwind from "./tailwind"
import { css } from "./tw-css"
import devices from "./devices"
import en from "./locale/en"

const plugin = (editor, opts = {}) => {
	const options = {
		...{
			i18n: {},
			// default options
			tailwindPlayCdn: "https://cdn.tailwindcss.com", // "https://cdn.buzzcasting.net/storage/tailwindcss/3.3.1.js"
			plugins: [],
			devices: devices,
			suggestions: {
				css: css,
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
		editor.getModel().set("tailwind-config", options.config)
	} else if (editor.getModel().get("tailwind-config") === undefined) {
		editor.getModel().set("tailwind-config", {
			content: [],
			theme: {
				extend: {}
			},
			plugins: []
		})
	}
	if (!!options.directives) {
		editor.getModel().set("tailwind-directives", options.directives)
	} else if (editor.getModel().get("tailwind-directives") === undefined) {
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
