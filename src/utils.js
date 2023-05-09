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
