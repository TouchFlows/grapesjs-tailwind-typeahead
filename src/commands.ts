import type { Editor } from "grapesjs"
import { clearTypeahead, addTypeAhead } from "./typeahead"
import { retrieveTailwindCss, addDirectives, getComponentAttributes } from "./utils"
import { regenerateTailwind } from "./suggestions"

export default (editor: Editor, options: any) => {
	const cmdOpenTailwind = "open-tailwind"
	const cmdOpenCode = "open-code"
	const cmdExportTemplate = "export-template"
	const cmdClearTypeahead = "clear-typeahead"
	const cmdAddTypeahead = "add-typeahead"
	const cmdRegerateTailwind = "regenerate-tailwind"
	const cmdAddDirectives = "add-directives"

	let config: string, directives: string

	const cmd = editor.Commands

	cmd.add(cmdAddDirectives, {
		run(editor) {
			addDirectives(editor)
		}
	})

	cmd.add(cmdClearTypeahead, {
		run(editor) {
			clearTypeahead(editor)
		}
	})

	cmd.add(cmdAddTypeahead, {
		run(editor) {
			addTypeAhead(editor, options)
		}
	})

	cmd.add(cmdRegerateTailwind, {
		run(editor) {
			regenerateTailwind(editor)
		}
	})

	cmd.add(cmdOpenTailwind, {
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
			config = window._twcss.theme
			// @ts-ignore
			directives = window._twcss.directives

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
			content.appendChild(errMessage)

			// Tabs
			const tabbar = document.createElement("div")
			tabbar.className = "tab"

			tabbar.appendChild(this.getTabLink("Configuration", configViewer, true))
			tabbar.appendChild(this.getTabLink("Directives", directivesViewer, false))
			content.appendChild(tabbar)

			const configTab = document.createElement("div")
			configTab.classList.add("tabcontent", "active")
			configTab.id = "configuration"
			configTab.appendChild(configViewer.getElement())
			content.appendChild(configTab)

			const directivesTab = document.createElement("div")
			directivesTab.classList.add("tabcontent")
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
			btn.classList.add("tablinks")
			btn.innerHTML = tabName
			if (active) btn.classList.add("active")
			btn.addEventListener("click", (ev) => this.openTab(ev, tabName.toLowerCase(), viewer))
			return btn
		},

		openTab(ev: MouseEvent, tabName: string, viewer: any) {
			let tabcontent, tablinks

			// Get all elements with class="tabcontent" and hide them
			tabcontent = Array.from(document.getElementsByClassName("tabcontent"))
			tabcontent.forEach((content) => content.classList.remove("active"))
			document.getElementById(tabName)?.classList.add("active")

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = Array.from(document.getElementsByClassName("tablinks"))
			tablinks.forEach((link) => link.classList.remove("active"))

			// Show the current tab, and add an "active" class to the button that opened the tab
			// @ts-ignore
			ev.currentTarget?.classList.add("active")

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
					theme: options.codeMirrorTheme,
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
					theme: options.codeMirrorTheme,
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
				document.querySelector(`.${pfx}tailwind-error`).innerHTML = editor.I18n.t("grapesjs-tailwind-typeahead.errorSettings")
				return
			}

			// @ts-ignore
			window._twcss = {
				directives: this.getDirectivesViewer().getContent(),
				theme: config
			}
			const model = editor.getModel()

			// Store the modified directives & config
			// @ts-ignore
			//model.set("directives", )
			// @ts-ignore
			//model.set("theme", config)

			editor.runCommand("add-directives")
			editor.runCommand("clear-typeahead")
			editor.runCommand("add-typeahead", options)

			// Save website if auto save is on
			// @ts-ignore
			model.set("changesCount", editor.getDirtyCount() + 1)
			editor.Modal.close()
		}
	})

	/**
	 * Show code viewer for HTML and Tailwind CSS classes
	 */
	cmd.add(cmdOpenCode, {
		/* eslint-disable-next-line */
		run(_editor, _s, _options) {
			this.showCode()
		},

		stop(editor) {
			editor.Modal.close()
		},

		showCode() {
			let html: string = "",
				css: string = ""

			if (options.removeWrapper) {
				const components = editor.getComponents()
				// @ts-ignore
				Array.from(components.models).forEach((component) => {
					// @ts-ignore
					html += `${component.toHTML({
						attributes(_component: any, attributes: any) {
							return getComponentAttributes(editor, options, attributes)
					}
					})}`
				})
			} else {
				const wrapper = editor.getWrapper()
				html = `${wrapper.toHTML({
					attributes(_component: any, attributes: any) {
						return getComponentAttributes(editor, options, attributes)
				}
				})}`
			}

			css = retrieveTailwindCss(editor.Pages.getSelected().getMainFrame().view.getEl().contentDocument)

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
			errMessage.className = `${pfx}tailwind-error`
			content.appendChild(errMessage)

			// Tabs
			const tabbar = document.createElement("div")
			tabbar.className = "tab"

			tabbar.appendChild(this.getTabLink("Html", htmlViewer, true))
			tabbar.appendChild(this.getTabLink("Css", cssViewer, false))
			content.appendChild(tabbar)

			const htmlTab = document.createElement("div")
			htmlTab.classList.add("tabcontent", "active")
			htmlTab.id = "html"
			htmlTab.appendChild(htmlViewer.getElement())
			content.appendChild(htmlTab)

			const cssTab = document.createElement("div")
			cssTab.classList.add("tabcontent")
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
			btn.classList.add("tablinks")
			btn.innerHTML = tabName
			if (active) btn.classList.add("active")
			btn.addEventListener("click", (ev) => this.openTab(ev, tabName.toLowerCase(), viewer))
			return btn
		},

		openTab(ev: MouseEvent, tabName: string, viewer: any) {
			let tabcontent, tablinks

			// Get all elements with class="tabcontent" and hide them
			tabcontent = Array.from(document.getElementsByClassName("tabcontent"))
			tabcontent.forEach((content) => content.classList.remove("active"))
			document.getElementById(tabName)?.classList.add("active")

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = Array.from(document.getElementsByClassName("tablinks"))
			tablinks.forEach((link) => link.classList.remove("active"))

			// Show the current tab, and add an "active" class to the button that opened the tab
			// @ts-ignore
			ev.currentTarget?.classList.add("active")

			viewer.refresh()
		},

		getHtmlViewer(): any {
			// @ts-ignore
			if (!this.htmlViewer) {
				// @ts-ignore
				this.htmlViewer = editor.CodeManager.createViewer({
					codeName: "htmlmixed",
					lineNumbers: false,
					theme: options.codeMirrorTheme,
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
					theme: options.codeMirrorTheme,
					readOnly: 1
				})
			}
			// @ts-ignore
			return this.cssViewer
		}
	})

	const pn = editor.Panels
	pn.removeButton("options", cmdExportTemplate)

	pn.addButton("options", {
		id: cmdOpenCode,
		className: "fa fa-code",
		attributes: {
			title: editor.I18n.t("grapesjs-tailwind-typeahead.codeTitle")
		},
		command: cmdOpenCode
	})

	pn.addButton("options", {
		id: cmdOpenTailwind,
		className: "tw-logo",
		attributes: {
			title: editor.I18n.t("grapesjs-tailwind-typeahead.modalTitle")
		},
		command: cmdOpenTailwind, //Open modal
		togglable: false,
	})
}
