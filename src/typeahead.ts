import typeahead from 'typeahead-standalone' //'./typeahead/typeahead'
import type { Editor, PluginOptions } from 'grapesjs'
import { tailwindSuggestions } from "./suggestions"

export const addTypeAhead = (editor: Editor, options: Required<PluginOptions> = {}) => {
  const prefix = editor.getConfig('stylePrefix') || 'gjs-'

  const container = editor.getContainer() as HTMLDivElement

  const input = container.querySelector(`#${prefix}clm-new`)  as HTMLInputElement
  // @ts-ignore
  window.tt = typeahead({
    limit: options.twCssLimit,
    input: input,
    source: {
      // @ts-ignore
      local: window._twcss.suggestions || []
    },
    highlight: true,
    templates: {
      suggestion: (item: any, _resultSet: any) => {
          if(item) {
            const propSpan =
            item.value.includes("#") || item.property.includes("rgb") ||  item.value.includes("gradient") // show colour preview
                ? `<span class="preview" style="background-color: ${item.value}" title="${item.value}"></span>`
                : `<span class="property" title="${item.value.includes("rem") ? parseFloat(item.value.replace("rem")) * 16 + "px" : item.value}">${item.value}</span>`
            return `${propSpan}<div class="text">${item ? item.label : ''}</div>`
          }
        return ''
      }
    }
  })
  //overwrite the offsetWidth
  const ttList = window.document.querySelector(`.tt-list`)  as HTMLDivElement
  ttList.style.width = '100%'  

  // @ts-ignore
  container.querySelector(`.${prefix}clm-header-status`).style.display = "none"
  // @ts-ignore
  container.querySelector(`.${prefix}clm-sels-info`).style.display = "none"
}

export const clearTypeahead = (editor: Editor, _options: any = {}) => {
  const prefix = editor.getConfig('stylePrefix')
	// Get selected Device
  const selected = editor.Devices.getSelected()

  // @ts-ignore
  let devicePrefix = ['desktop', 'full'].includes(selected.id) ? '' : `${selected.id}:`

  // @ts-ignore
  let darkTheme = window._twcss.dark ? 'dark:' : ''

  tailwindSuggestions(editor, editor.Canvas.getFrameEl(), devicePrefix, darkTheme)

  const tagsField = window.document.getElementById(`${prefix}clm-tags-field`) as HTMLDivElement
  
  if(tagsField == null) return

  const inputField = tagsField.querySelector(`#${prefix}clm-new`) as HTMLInputElement
  // bugfix: move up to reset position before invoking typeahead (the + action is bound to the element)
  inputField.setAttribute('placeholder', editor.I18n.t('grapesjs-tailwind-typeahead.inputHint'))
  tagsField.appendChild(inputField)
  tagsField.removeChild(tagsField.querySelector(".typeahead-standalone"))
  // @ts-ignore
  window.tt.destroy()
}