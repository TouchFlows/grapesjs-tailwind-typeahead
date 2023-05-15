import type { Editor } from 'grapesjs';

export function addStyle(id = "typeahead", css = "") {
	let styleTag = document.getElementById(id)
	if (styleTag === null) {
		styleTag = document.createElement("style")
		styleTag.id = id
		const head = document.getElementsByTagName("head")[0]
		head.appendChild(styleTag)
	}
	styleTag.innerHTML = css
}



export function insertOnce(doc: Document, attr: string, tag: string, attributes: any) {
	if (!doc.head.querySelector(`[${attr}]`)) {
		insert(doc, attr, tag, attributes)
	}
}
export function insert(doc: Document, attr: string, tag: string, attributes: any) {
	const el = doc.head.querySelector(`[${attr}]`) || doc.createElement(tag)
  if(el.getAttribute(attr) == null) {
    el.setAttribute(attr, "")
		// @ts-ignore
	  Object.keys(attributes).forEach((key) => el.setAttribute(key, attributes[key]))
	  doc.head.appendChild(el)
  }
  return el
}
export function removeAll(doc: Document, attr: string) {
	doc.head.querySelector(`[${attr}]`) != null && Array.from(doc.head.querySelectorAll(`[${attr}]`)).forEach((el) => el.parentElement?.removeChild(el))
}

export const appendDirectives = (editor: Editor) => {
  const pageManager = editor.Pages
  pageManager.getAll().forEach((page) => {
    page.getAllFrames().forEach((frame) => {
      const doc = frame.view?.getEl().contentDocument
      //removeAll(doc, 'directives')
			if(doc == null ) return
			// @ts-ignore
      const el = insert(doc, 'directives', 'style', {type: 'text/tailwindcss'})
			// @ts-ignore
      el.innerHTML = editor.getModel().get("tailwind-directives")
    })
  })
}


