import { setTailwindSuggestions } from "./tailwind"
import { config, css } from "./config"
import typeahead from "typeahead-standalone"
import { addStyle } from "./utils"
import en from "./locale/en"

export default (editor, opts = {}) => {
	let devicePrefix = ""
	// Editor style prefix (still needed?)
	const prefix = editor.Config.selectorManager.pStylePrefix

	const options = {
		...{
			i18n: {},
			// default options
			tailwindPlayCdn: "https://cdn.tailwindcss.com", // "https://cdn.buzzcasting.net/storage/tailwindcss/3.3.1.js"
			plugins: [],
			config: config,
			suggestions: {
				css: css,
				limit: 10
			},
			modifySettingsText: "Settings for Tailwind CSS"
		},
		...opts
	}

	editor.I18n &&
		editor.I18n.addMessages({
			en,
			...options.i18n
		})

	const appendTailwindCss = async (frame) => {
		const iframe = frame.view.getEl()

		if (!iframe) return

		const { tailwindPlayCdn, plugins, config } = options

		const init = () => {
			iframe.contentWindow.tailwind.config = config

			setTailwindSuggestions(iframe, devicePrefix)
			addStyle("typeahead", options.suggestions.css)
      addTypeAhead(editor)
			// Do not show the selector
			editor.getContainer().querySelector(`.${prefix}clm-sels-info`).style.display = "none"
		}

		const doc = iframe.contentDocument
		const baseTailwind = document.createElement("style")
		baseTailwind.type = "text/tailwindcss"
		baseTailwind.innerHTML = `
		@import url("https://cdn.buzzcasting.net/fonts/publico/publico.css");
		@import url("https://cdn.buzzcasting.net/fonts/sourcesans/sourcesans.css");
		@tailwind base;
		@tailwind components;
		@tailwind utilities;`
		doc.head.appendChild(baseTailwind)

		const script = document.createElement("script")
		doc.head.appendChild(script)
		script.onload = init
		script.src = tailwindPlayCdn + (plugins.length ? `?plugins=${plugins.join()}` : "")
		console.log("generate")
	}

  function addTypeAhead(editor) {
    window.tt = typeahead({
      limit: options.suggestions.limit,
      input: window.document.querySelector(`#${prefix}clm-new`),
      source: {
        local: editor.Canvas.getWindow().tailwind.suggestions
      },
      highlight: true,
      templates: {
        suggestion: (item, resultSet) => {
          const propSpan =
            item.value.includes("#") || item.property.includes("rgb") || item.value.includes("linear")
              ? `<span class="preview" style="background-color: ${item.value}" title="${item.value}"></span>`
              : `<span class="property" title="${item.value.includes("rem") ? parseFloat(item.value.replace("rem")) * 16 + "px" : item.value}">${item.value}</span>`
          return `${propSpan}<div class="text">${item.label}</div>`
        }
      }
    })
  }

	editor.Canvas.getModel()["on"]("change:frames", (_m, frames) => {
		frames.forEach((frame) =>
			frame.once("loaded", () => {
				appendTailwindCss(frame)
			})
		)
	})
	editor.on("device:select", () => {
		// Get selected Device
		const selected = editor.Devices.getSelected()

    let devicePrefix = selected.id === 'desktop' ? '' : `${selected.id}:`

		setTailwindSuggestions(editor.Canvas.getFrameEl(), devicePrefix)

    const tagsField = window.document.getElementById(`${prefix}clm-tags-field`)
    const inputField = tagsField.querySelector(`#${prefix}clm-new`)
    // bugfix: move up to reset position before invoking typeahead (the + action is bound to the element)
    tagsField.appendChild(inputField)
    tagsField.removeChild(tagsField.querySelector('.typeahead-standalone'))
    window.tt.destroy()
    addTypeAhead(editor)   
    
	})
}
