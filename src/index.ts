import type { Editor, Plugin } from "grapesjs"
import './grapesjs-tailwind-typeahead.css'
import commands from "./commands"
import tailwind from "./tailwind"
import devices from "./devices"
import en from "./locale/en"
import events from "./events"

const plugin: Plugin = (editor: Editor, opts: any = {}) => {
	const options = {
		...{
			i18n: {},
			// default options
			tailwindPlayCdn: "https://cdn.tailwindcss.com",
			plugins: [],
			devices: devices,
			suggestions: {
				limit: 12
			},
			removeWrapper: true,
			removeId: true
		},
		...opts
	}

	editor.I18n &&
		editor.I18n.addMessages({
			en,
			...options.i18n
		})

	if (!!options.theme) {
		// @ts-ignore
		editor.getModel().set("theme", options.theme)
	} else 
	// @ts-ignore
	if (editor.getModel().get("theme") === undefined) {
		// @ts-ignore
		editor.getModel().set("theme", {
			theme: {
				extend: {}
			}
		})
	}
	if (!!options.directives) {
		// @ts-ignore
		editor.getModel().set("directives", options.directives)
	} else 
	// @ts-ignore
	if (editor.getModel().get("directives") === undefined) {
		// @ts-ignore
		editor.getModel().set(
			"directives",
			'@tailwind base;\n@tailwind components;\n@tailwind utilities;'
		)
	}
	// Add TailwindCSS
	commands(editor, options)
	// Add commands
	tailwind(editor, options)

	events(editor, options)
}

export default plugin
