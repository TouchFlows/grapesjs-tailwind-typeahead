import typeahead from "./typeahead/typeahead"
import type { Editor } from 'grapesjs';
import { tailwindSuggestions } from "./suggestions"

export const addTypeAhead = (editor: Editor, options: any) => {
  const prefix = editor.Config.selectorManager?.stylePrefix || 'gjs-'

  const input = window.document.querySelector(`#${prefix}clm-new`)  as HTMLInputElement
  // @ts-ignore
  window.tt = typeahead({
    limit: options.suggestions?.limit,
    input: input,
    source: {
      // @ts-ignore
      local: editor.Canvas.getWindow().tailwind.suggestions
    },
    highlight: true,
    templates: {
      suggestion: (item: any, _resultSet: any) => {
          
        const propSpan =
          item.value.includes("#") || item.property.includes("rgb") || item.value.includes("gradient")
            ? `<span class="preview" style="background-color: ${item.value}" title="${item.value}"></span>`
            : `<span class="property" title="${item.value.includes("rem") ? parseFloat(item.value.replace("rem")) * 16 + "px" : item.value}">${item.value}</span>`
        return `${propSpan}<div class="text">${item.label}</div>`
      }
    }
  })
  //overwrite the offsetWidth
  const ttList = window.document.querySelector(`.tt-list`)  as HTMLDivElement
  ttList.style.width = '100%'
}

export const clearTypeahead = (editor: Editor, _options: any) => {
  const prefix = editor.Config.selectorManager?.stylePrefix
	// Get selected Device
  const selected = editor.Devices.getSelected()

  // @ts-ignore
  let devicePrefix = selected.id === "desktop" ? '' : `${selected.id}:`

  tailwindSuggestions(editor, editor.Canvas.getFrameEl(), devicePrefix)

  const tagsField = window.document.getElementById(`${prefix}clm-tags-field`) as HTMLElement
  if(tagsField == null) return

  const inputField = tagsField.querySelector(`#${prefix}clm-new`) as HTMLInputElement
  // bugfix: move up to reset position before invoking typeahead (the + action is bound to the element)
  tagsField.appendChild(inputField)
  // @ts-ignore
  tagsField.removeChild(tagsField.querySelector(".typeahead-standalone"))
  // @ts-ignore
  window.tt.destroy()
}