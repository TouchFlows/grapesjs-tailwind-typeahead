import type { Editor } from 'grapesjs';

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

export function retrieveTailwindCss(doc: Document) {
  let contents = ''
  const styleDefs = doc.head.querySelectorAll('style')
  for( let styleDef of Array.from(styleDefs)) {
    contents = styleDef.innerHTML
    if(contents.includes('tailwindcss')) break
  }
  return contents
}

export function removeAll(doc: Document, attr: string) {
	doc.head.querySelector(`[${attr}]`) != null && Array.from(doc.head.querySelectorAll(`[${attr}]`)).forEach((el) => el.parentElement?.removeChild(el))
}

export const addDirectives = (editor: Editor) => {
  const pageManager = editor.Pages
  pageManager.getAll().forEach((page) => {
    page.getAllFrames().forEach((frame) => {
      const doc = frame.view?.getEl().contentDocument
      //removeAll(doc, 'directives')
      if(doc == null ) return
      // @ts-ignore
      const el = insert(doc, 'directives', 'style', {type: 'text/tailwindcss'})
      // @ts-ignore
      el.innerHTML = window._twcss.directives || 
      `@tailwind base;
@tailwind components;
@tailwind utilities;`
    })
  })
}

export function getComponentAttributes(editor: Editor, options: any, attributes: any) {
  const prefix = editor.getConfig('stylePrefix') || 'gjs-'
	const cssRules = editor.Css
	let style: string = ""
	// @ts-ignore
	const rules = cssRules.getIdRule(attributes.id)?.attributes?.style
	if (rules) {
			style = ''
			// add style to the attributes, specifically to keep background images in the html output
			Object.keys(rules).forEach(key => {
					style += `${key}:${rules[key]};`
			})
      if(style.length) attributes.style = style
	}
  // remove if id does not start with the prefix
	options.removeId && !attributes.id.startsWith(prefix) && delete attributes.id
	return attributes
}

/*export async function generateTailwindCss(html: string) {
  return (await postcss([tailwindcss({
    content: [{ raw:html }],
    theme: {
      extend: {},
    },
    plugins: [],
  }), autoprefixer, cssnano])
  .process(`
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
  `)).css
}*/

