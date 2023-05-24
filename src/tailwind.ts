import type { Editor } from "grapesjs"
import { tailwindSuggestions } from "./suggestions"
import { insert } from "./utils"
import { clearTypeahead, addTypeAhead } from "./typeahead"

export default (editor: Editor, options: any = {}) => {
	// Editor style prefix (still needed?)
	const prefix = editor.Config.selectorManager?.stylePrefix || 'gjs-'

	const appendTailwindCss = async (frame: HTMLIFrameElement) => {
		// @ts-ignore
		const iframe = frame.view.getEl()

		if (!iframe) return

		const { tailwindPlayCdn, plugins } = options

		const init = () => {
			tailwindSuggestions(editor, iframe, '')

			addTypeAhead(editor, options)

			// Do not show the selector
			// @ts-ignore
			editor.getContainer().querySelector(`.${prefix}clm-header-status`).style.display = "none"
			// @ts-ignore
			editor.getContainer().querySelector(`.${prefix}clm-sels-info`).style.display = "none"
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

	editor.on("device:select", () => {
		clearTypeahead(editor, options)
		addTypeAhead(editor, options)
	})
}
