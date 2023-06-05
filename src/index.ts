import type { Editor, Plugin } from "grapesjs"
import "./grapesjs-tailwind-typeahead.css"
import commands from "./commands"
import tailwind from "./tailwind"
import en from "./locale/en"
import events from "./events"

const plugin: Plugin = (editor: Editor, opts: any = {}) => {
	const options = {
		...{
			//i18n: {},
			// default options
			twCssPlayCdn: "https://cdn.tailwindcss.com",
			twCssPlugins: ['aspect-ratio','forms'],
			twCssTheme: { theme: {} },
			twCssDirectives: "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
			twCssRemoveWrapper: true,
			twCssRemoveId: true,
			twCssDark: false,
			twCssLimit: 12,
			codeMirrorTheme: "hopscotch"
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
		directives: options.twCssDirectives,
		theme: options.twCssTheme,
		suggestions: [],
		dark: options.twCssDark
	}
	// Add TailwindCSS
	tailwind(editor, options)
	// Add commands
	commands(editor, options)

	events(editor, options)
}

export default plugin
