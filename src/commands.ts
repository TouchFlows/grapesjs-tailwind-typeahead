import type { Editor } from "grapesjs"
import { clearTypeahead, addTypeAhead } from "./typeahead"
import { appendDirectives, retrieveTailwindCss } from "./utils"
//import { regenerateTailwind } from "./suggestions"

export default (editor: Editor, options: any) => {
	const cmdOpenTailwind = 'open-tailwind'
	const cmdOpenCode = 'open-code'
	const cmdExportTemplate = 'export-template'

	let config: string, directives: string, html: string = '', css: string = ''

	editor.Commands.add(cmdOpenTailwind, {
		/* eslint-disable-next-line */
		run(_editor, _s, _options) {
			this.showTailwindSettings()
		},

		stop(_editor) {
			editor.Modal.close()
		},

		/**
		 * Method which tells how to show the tailwind settings
		 */
		showTailwindSettings() {
			const title = editor.I18n.t("grapesjs-tailwind-typeahead.modalTitle")
			// @ts-ignore
			config = structuredClone(editor.getModel().get("tailwind-config"))
			// @ts-ignore
			directives = editor.getModel().get("tailwind-directives")

			// @ts-ignore
			const content = this.getContent()
			editor.Modal.open({ title, content }).onceClose(() => editor.stopCommand(cmdOpenTailwind))
			// @ts-ignore
			this.getConfigViewer().setContent(JSON.stringify(config, null, 2))
			this.getDirectivesViewer().setContent(directives)
		},

		getContent() {
			const configViewer = this.getConfigViewer()
			const directivesViewer = this.getDirectivesViewer()

			const pfx = editor.getConfig("stylePrefix")

			const content = document.createElement("div")
			content.className = `${pfx}tailwind-settings`

			const errMessage = document.createElement("div")
			errMessage.className = `${pfx}tailwind-error`
			errMessage.setAttribute("style", "color:lightblue; font-size: .75rem;font-weight: lighter; padding: 5px; height:20px")
			content.appendChild(errMessage)

			// Tabs
			const tabbar = document.createElement("div")
			tabbar.className = "tab"

			tabbar.appendChild(this.getTabLink("Configuration", configViewer, true))
			tabbar.appendChild(this.getTabLink("Directives", directivesViewer, false))
			content.appendChild(tabbar)

			const configTab = document.createElement("div")
			configTab.classList.add('tabcontent','active')
			configTab.id = "configuration"
			configTab.appendChild(configViewer.getElement())
			content.appendChild(configTab)

			const directivesTab = document.createElement("div")
			directivesTab.classList.add('tabcontent')
			directivesTab.id = "directives"
			directivesTab.appendChild(directivesViewer.getElement())
			content.appendChild(directivesTab)

			// Save button
			content.appendChild(this.getContentActions())

			configViewer.refresh()
			directivesViewer.refresh()

			setTimeout(() => configViewer.focus(), 0)

			return content
		},

		getTabLink(tabName: string, viewer: any, active: boolean) {
			const btn = document.createElement("button")
			btn.classList.add('tablinks')
			btn.innerHTML = tabName
			if(active) btn.classList.add('active')
			btn.addEventListener('click', ev => this.openTab(ev, tabName.toLowerCase(), viewer))
			return btn
		},

		openTab(ev: MouseEvent, tabName: string, viewer: any) {
			let tabcontent, tablinks

			// Get all elements with class="tabcontent" and hide them
			tabcontent = Array.from(document.getElementsByClassName("tabcontent"))
			tabcontent.forEach(content => content.classList.remove('active'))
			document.getElementById(tabName)?.classList.add('active')

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = Array.from(document.getElementsByClassName("tablinks"))
			tablinks.forEach(link => link.classList.remove('active'))

			// Show the current tab, and add an "active" class to the button that opened the tab
			// @ts-ignore
			ev.currentTarget?.classList.add('active')

			viewer.refresh()
		},

		/**
		 * Get the actions content. Can be a simple string or an HTMLElement
		 * @return {HTMLElement|String}
		 */
		getContentActions() {
			const btn = document.createElement("button")
			btn.setAttribute("type", "button")
			const pfx = editor.getConfig("stylePrefix")
			btn.innerHTML = editor.I18n.t("grapesjs-tailwind-typeahead.buttonLabel")
			btn.className = `${pfx}btn-prim ${pfx}btn-save__tailwind`
			btn.onclick = () => this.handleSave()
			return btn
		},

		getConfigViewer() {
			// @ts-ignore
			if (!this.configViewer) {
				// @ts-ignore
				this.configViewer = editor.CodeManager.createViewer({
					codeName: "javascript",
					mode: "application/ld+json",
					theme: "hopscotch",
					readOnly: 0
					//...themeViewOptions,
				})
			}
			// @ts-ignore
			return this.configViewer
		},

		getDirectivesViewer() {
			// @ts-ignore
			if (!this.directivesViewer) {
				// @ts-ignore
				this.directivesViewer = editor.CodeManager.createViewer({
					codeName: "htmlmixed",
					theme: "hopscotch",
					readOnly: 0
				})
			}
			// @ts-ignore
			return this.directivesViewer
		},

		handleSave() {
			try {
				config = JSON.parse(this.getConfigViewer().getContent())
			} catch (ex) {
				const pfx = editor.getConfig("stylePrefix")
				// @ts-ignore
				document.querySelector(`.${pfx}tailwind-error`).innerHTML = "There is an error in your settings, please check"
				return
			}

			const model = editor.getModel()

			// Store the modified directives & config
			// @ts-ignore
			model.set("tailwind-directives", this.getDirectivesViewer().getContent())

			appendDirectives(editor)

			// @ts-ignore
			model.set("tailwind-config", config)

			clearTypeahead(editor, options)
			addTypeAhead(editor, options)

			// Save website if auto save is on
			// @ts-ignore
			model.set("changesCount", editor.getDirtyCount() + 1)
			editor.Modal.close()
		},

	})

	/**
	 * Show code viewer for HTML and Tailwind CSS classes
	 */
	editor.Commands.add(cmdOpenCode, {
		/* eslint-disable-next-line */
		run(_editor, _s, _options) {
			this.showCode()
		},

		stop(editor) {
			editor.Modal.close()
		},

		showCode() {
			const selectedPage = editor.Pages.getSelected();
			const main: any = selectedPage?.getMainComponent()

			if(options.removeBodyFromHTML) {
				for(let i = 0; i < main.components.length; i++ ) {
					// Body may have multiple child nodes
					html += `${editor.getHtml({component: main.getChildAt(i), cleanId: true})}\n`
				}
			} else {
				html = editor.getHtml({component: main, cleanId: true})
			}
			css = retrieveTailwindCss(editor.Canvas.getDocument())
			

			const title = editor.I18n.t("grapesjs-tailwind-typeahead.codeTitle")
			const content = this.getTailwindContent()
			editor.Modal.open({ title, content }).onceClose(() => editor.stopCommand(cmdOpenTailwind))
			// @ts-ignore
			this.getHtmlViewer().setContent(html)
			this.getCssViewer().setContent(css)
		},

		getTailwindContent() {
			const htmlViewer = this.getHtmlViewer()
			const cssViewer = this.getCssViewer()

			const pfx = editor.getConfig("stylePrefix")

			const content = document.createElement("div")
			content.className = `${pfx}code-viewer`

			const errMessage = document.createElement("div")
			errMessage.className = `${pfx}code-error`
			errMessage.setAttribute("style", "color:lightblue; font-size: .75rem;font-weight: lighter; padding: 5px; height:20px")
			content.appendChild(errMessage)

			// Tabs
			const tabbar = document.createElement("div")
			tabbar.className = "tab"

			tabbar.appendChild(this.getTabLink("Html", htmlViewer, true))
			tabbar.appendChild(this.getTabLink("Css", cssViewer, false))
			content.appendChild(tabbar)

			const htmlTab = document.createElement("div")
			htmlTab.classList.add('tabcontent','active')
			htmlTab.id = "html"
			htmlTab.appendChild(htmlViewer.getElement())
			content.appendChild(htmlTab)

			const cssTab = document.createElement("div")
			cssTab.classList.add('tabcontent')
			cssTab.id = "css"
			cssTab.appendChild(cssViewer.getElement())
			content.appendChild(cssTab)

			htmlViewer.refresh()
			cssViewer.refresh()

			setTimeout(() => htmlViewer.focus(), 0)

			return content
		},

		getTabLink(tabName: string, viewer: any, active: boolean) {
			const btn = document.createElement("button")
			btn.classList.add('tablinks')
			btn.innerHTML = tabName
			if(active) btn.classList.add('active')
			btn.addEventListener('click', ev => this.openTab(ev, tabName.toLowerCase(), viewer))
			return btn
		},

		openTab(ev: MouseEvent, tabName: string, viewer: any) {
			let tabcontent, tablinks

			// Get all elements with class="tabcontent" and hide them
			tabcontent = Array.from(document.getElementsByClassName("tabcontent"))
			tabcontent.forEach(content => content.classList.remove('active'))
			document.getElementById(tabName)?.classList.add('active')

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = Array.from(document.getElementsByClassName("tablinks"))
			tablinks.forEach(link => link.classList.remove('active'))

			// Show the current tab, and add an "active" class to the button that opened the tab
			// @ts-ignore
			ev.currentTarget?.classList.add('active')

			viewer.refresh()
		},

		getHtmlViewer(): any {
			// @ts-ignore
			if (!this.htmlViewer) {
				// @ts-ignore
				this.htmlViewer = editor.CodeManager.createViewer({
					codeName: "htmlmixed",
					lineNumbers: false,
					theme: "hopscotch",
					readOnly: 1
					//...themeViewOptions,
				})
			}
			// @ts-ignore
			return this.htmlViewer
		},

		getCssViewer(): any {
			// @ts-ignore
			if (!this.cssViewer) {
				// @ts-ignore
				this.cssViewer = editor.CodeManager.createViewer({
					codeName: "css",
					lineNumbers: false,
					mode: "text/css",
					theme: "hopscotch",
					readOnly: 1
				})
			}
			// @ts-ignore
			return this.cssViewer
		},

	})

	const pn = editor.Panels
	pn.removeButton('options', cmdExportTemplate)

	pn.addButton("options", {
		id: cmdOpenCode,
		className: 'fa fa-code',
		attributes: {
			title: editor.I18n.t("grapesjs-tailwind-typeahead.codeTitle")
		},
		command: cmdOpenCode
	})

	pn.addButton('options', {
		id: cmdOpenTailwind,
		className: 'tw-logo',
		attributes: {
			title: editor.I18n.t("grapesjs-tailwind-typeahead.modalTitle")
		},
		command: cmdOpenTailwind //Open modal
	})

	/**
	 * regenrate tailwind css classes when a selector is removed
	 */
	editor.on('selector:remove', (/*selector*/) => { 
		// TODO: not suffisient to regenerate
		//regenerateTailwind(editor)
		//change something in theme or directives?
	 });

	// add directives to the website
	editor.on("storage:start:store", (data: any) => {
		// @ts-ignore
		data.directives = editor.getModel().get("tailwind-directives")
		// @ts-ignore
		data.config = editor.getModel().get("tailwind-config")
	})

	editor.on("storage:end:load", (_data: any) => {
		// @ts-ignore
		editor.getModel().set("tailwind-directives", directives)
		// @ts-ignore
		editor.getModel().set("tailwind-config", config)
	})
}
