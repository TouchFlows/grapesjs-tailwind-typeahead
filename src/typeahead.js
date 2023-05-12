import typeahead from "typeahead-standalone"
import { tailwindSuggestions } from "./suggestions"

export const addTypeAhead = (editor, options) => {
  const prefix = editor.Config.selectorManager.pStylePrefix
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
          item.value.includes("#") || item.property.includes("rgb") || item.value.includes("gradient")
            ? `<span class="preview" style="background-color: ${item.value}" title="${item.value}"></span>`
            : `<span class="property" title="${item.value.includes("rem") ? parseFloat(item.value.replace("rem")) * 16 + "px" : item.value}">${item.value}</span>`
        return `${propSpan}<div class="text">${item.label}</div>`
      }
    }
  })
}

export const clearTypeahead = (editor, options) => {
  const prefix = editor.Config.selectorManager.pStylePrefix
	// Get selected Device
  const selected = editor.Devices.getSelected()

  let devicePrefix = selected.id === "desktop" ? '' : `${selected.id}:`

  tailwindSuggestions(editor.Canvas.getFrameEl(), devicePrefix)

  const tagsField = window.document.getElementById(`${prefix}clm-tags-field`)
  const inputField = tagsField.querySelector(`#${prefix}clm-new`)
  // bugfix: move up to reset position before invoking typeahead (the + action is bound to the element)
  tagsField.appendChild(inputField)
  tagsField.removeChild(tagsField.querySelector(".typeahead-standalone"))
  window.tt.destroy()
}