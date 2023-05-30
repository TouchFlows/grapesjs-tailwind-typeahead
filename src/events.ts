import type { Editor } from "grapesjs"

export default (editor: Editor, options: any) => {
  editor.on("device:select", () => {
		editor.runCommand('clear-typeahead')
		editor.runCommand('add-typeahead')
	})
	/**
	 * regenrate tailwind css classes when a selector is removed
	 */
	editor.on("selector:remove", (/*selector*/) => {
		// TODO: not suffisient to regenerate
		//regenerateTailwind(editor)
		//change something in theme or directives?
	})

	// add directives to the website
	editor.on("storage:start:store", (data: any) => {
    
    data.tailwind = {
      // @ts-ignore
      directives: window._twcss.directives,
      // @ts-ignore
      theme: window._twcss.theme
    }
	})

	editor.on("storage:end:load", (data: any) => {
    
    // @ts-ignore
    window._twcss = {
      directives: data.tailwind?.directives || options.directives,
      theme: data.tailwind?.theme || options.theme
    }

	})
}
