import { clearTypeahead, addTypeAhead } from "./typeahead"
import { appendDirectives } from "./utils"

export default (editor, options) => {
	const cmdOpenTailwind = "open-tailwind"
	let config, directives

	editor.Commands.add(cmdOpenTailwind, {
		/* eslint-disable-next-line */
		run(editor, s, options) {
			this.showTailwindSettings(editor)
		},

		stop(editor) {
			editor.Modal.close()
		},

		/**
		 * Method which tells how to show the tailwind settings
		 */
		showTailwindSettings(editor) {
			const title = editor.I18n.t("grapesjs-tailwind-typeahead.modalTitle")
			config = structuredClone(editor.getModel().get("tailwind-config"))
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

		getTabLink(tabName, viewer, active) {
			const btn = document.createElement("button")
			btn.classList.add('tablinks')
			btn.innerHTML = tabName
			if(active) btn.classList.add('active')
			btn.addEventListener('click', ev => this.openTab(ev, tabName.toLowerCase(), viewer))
			return btn
		},

		openTab(ev, tabName, viewer) {
			let i, tabcontent, tablinks

			// Get all elements with class="tabcontent" and hide them
			tabcontent = Array.from(document.getElementsByClassName("tabcontent"))
			tabcontent.forEach(content => content.classList.remove('active'))
			document.getElementById(tabName).classList.add('active')

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = Array.from(document.getElementsByClassName("tablinks"))
			tablinks.forEach(link => link.classList.remove('active'))

			// Show the current tab, and add an "active" class to the button that opened the tab
			ev.currentTarget.classList.add('active')

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
				document.querySelector(`.${pfx}tailwind-error`).innerHTML = "There is an error in your settings, please check"
				return
			}

			const model = editor.getModel()

			// Store the modified directives & config
			model.set("tailwind-directives", this.getDirectivesViewer().getContent())

			appendDirectives(editor)

			model.set("tailwind-config", config)

			clearTypeahead(editor)
			addTypeAhead(editor, options)

			// Save website if auto save is on
			model.set("changesCount", editor.getDirtyCount() + 1)
			editor.Modal.close()
		},

		async wait(ms = 0) {
			return new Promise((resolve) => setTimeout(() => resolve(), ms))
		}
	})

	const pn = editor.Panels
	pn.addButton("options", {
		id: cmdOpenTailwind,
		className: "tw-logo",
		attributes: {
			title: editor.I18n.t("grapesjs-tailwind-typeahead.modalTitle")
		},
		command: cmdOpenTailwind //Open modal
	})

	// add fonts to the website
	editor.on("storage:start:store", (data) => {
		data.directives = editor.getModel().get("tailwind-directives")
		data.config = editor.getModel().get("tailwind-config")
	})

	editor.on("storage:end:load", (data) => {
		editor.getModel().set("tailwind-directives", directives)
		editor.getModel().set("tailwind-config", config)
	})
}
