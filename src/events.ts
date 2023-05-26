import { Editor, PluginOptions } from 'grapesjs';

export default (editor: Editor, _options: Required<PluginOptions> = {}) => {

	editor.on("device:select", () => {
		editor.runCommand('clear-typeahead')
		editor.runCommand('add-typeahead')
	})

}