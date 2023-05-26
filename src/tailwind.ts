import type { Editor } from "grapesjs"
import { tailwindSuggestions } from "./suggestions"
import { insert } from "./utils"

export default (editor: Editor, options: any = {}) => {
	// Editor style prefix (still needed?)
	const prefix = editor.getConfig('stylePrefix')

	const appendTailwindCss = async (frame: HTMLIFrameElement) => {
		// @ts-ignore
		const iframe = frame.view.getEl()

		if (!iframe) return

		const { tailwindPlayCdn, plugins } = options

		const init = () => {
			tailwindSuggestions(editor, iframe, '')

			editor.runCommand('add-typeahead')

			editor.runCommand('add-directives')

			// Do not show the selector
			const container = editor.getContainer() as HTMLDivElement

			// @ts-ignore
			container.querySelector(`.${prefix}clm-header-status`).style.display = "none"
			// @ts-ignore
			container.querySelector(`.${prefix}clm-sels-info`).style.display = "none"
		}
		// add the tailwind directives to a style element
		// appendDirectives(editor)

		const tw = insert(iframe.contentDocument, 'tailwindcss', 'script', {src: tailwindPlayCdn + (plugins.length ? `?plugins=${plugins.join()}` : "")})
		// @ts-ignore
		tw.onload = init
	}

	// @ts-ignore
	editor.Canvas.getModel()["on"]("change:frames", (_m, frames: HTMLIFrameElement[]) => {
		frames.forEach((frame) =>
		// @ts-ignore
			frame.once("loaded", () => {
				appendTailwindCss(frame)
			})
		)
	})
}
