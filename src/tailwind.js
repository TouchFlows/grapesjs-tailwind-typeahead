import { tailwindSuggestions } from "./suggestions"
import { appendDirectives, insert } from "./utils"
import { clearTypeahead, addTypeAhead } from "./typeahead"

export default (editor, options = {}) => {
	// Editor style prefix (still needed?)
	const prefix = editor.Config.selectorManager.pStylePrefix

	const appendTailwindCss = async (frame) => {
		const iframe = frame.view.getEl()

		if (!iframe) return

		const { tailwindPlayCdn, plugins } = options

		const init = () => {
			tailwindSuggestions(editor, iframe, '')
			const el = insert(top.document, 'typeahead', 'style', {})
			el.innerHTML =  options.suggestions.css

			addTypeAhead(editor, options)

			// Do not show the selector
			editor.getContainer().querySelector(`.${prefix}clm-header-status`).style.display = "none"
			editor.getContainer().querySelector(`.${prefix}clm-sels-info`).style.display = "none"
		}
		// add the tailwind directives to a style element
		appendDirectives(editor)

		const doc = iframe.contentDocument

		const tw = insert(iframe.contentDocument, 'tailwindcss', 'script', {src: tailwindPlayCdn + (plugins.length ? `?plugins=${plugins.join()}` : "")})
		tw.onload = init
	}

	editor.Canvas.getModel()["on"]("change:frames", (_m, frames) => {
		frames.forEach((frame) =>
			frame.once("loaded", () => {
				appendTailwindCss(frame)
			})
		)
	})

	editor.on("device:select", () => {
		clearTypeahead(editor)
		addTypeAhead(editor, options)
	})
}
