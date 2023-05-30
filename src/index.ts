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
			removeId: true,
			theme: {"theme":{}},
			directives: '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
		},
		...opts
	}

	editor.I18n &&
		editor.I18n.addMessages({
			en,
			...options.i18n
		})

	// @ts-ignore
	window._twcss = {
		directives: options.directives,
		theme: options.theme,
		suggestions: []
	}
	// Add TailwindCSS
	tailwind(editor, options)
	// Add commands
	commands(editor, options)

	events(editor, options)
}

export default plugin
