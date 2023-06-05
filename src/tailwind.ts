import type { Editor } from "grapesjs"
import { tailwindSuggestions } from "./suggestions"
import { insert } from "./utils"

export default (editor: Editor, options: any = {}) => {

	const appendTailwindCss = async (frame: HTMLIFrameElement) => {
		// @ts-ignore
		const iframe = frame.view.getEl()

		if (!iframe) return

		const { twCssPlayCdn, twCssPlugins } = options

		const init = () => {

			editor.runCommand('add-directives')

			tailwindSuggestions(editor, iframe, '')
			
			editor.runCommand('add-typeahead')
		}

		const tw = insert(iframe.contentDocument, 'tailwindcss', 'script', {src: twCssPlayCdn + (twCssPlugins.length ? `?plugins=${twCssPlugins.join()}` : "")})
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
