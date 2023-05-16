import type { Editor } from "grapesjs"

/**
 * Force Tailwind regeneration
 * @param editor
 * @param frame
 * @returns
 */
export const regenerateTailwind = (editor: Editor) => {
	// @ts-ignore
	const tailwind = editor.Canvas.getWindow().tailwind
	// @ts-ignore
	tailwind.config = editor.getModel().get("tailwind-config")
	tailwind.resolveConfig(tailwind.config)
}

export const tailwindSuggestions = (editor: Editor, frame: HTMLIFrameElement, devicePrefix: string) => {
	// @ts-ignore
	const tailwind = frame.contentWindow?.tailwind
	// @ts-ignore
	tailwind.config = editor.getModel().get("tailwind-config")
	const fullConfig = tailwind.resolveConfig(tailwind.config)

	//const fullConfig =  regenerateTailwind(editor, frame)

	let entries = [],
		property: string | Node = "",
		nodeNames: string[] = []

	function baseClass(base: string) {
		switch (base) {
			case "accentColor":
				return "accent"
			case "backgroundBlendMode":
				return "bg-blend"
			case "backgroundColor":
			case "backgroundImage":
				return "bg"
			case "backgroundOpacity":
				return "opacity"
			case "borderColor":
			case "borderWidth":
				return "border"
			case "borderRadius":
				return "rounded"
			case "boxShadow":
			case "boxShadowColor":
				return "shadow"
			case "caretColor":
				return "caret"
			case "divideColor":
				return "divide"
			case "flexBasis":
				return "basis"
			case "fontFamily":
				return "font"
			case "fontSize":
				return "text"
			case "gradientColorStart":
				return "from"
			case "gradientColorStops":
				return "to"
			case "gridAutoColumns":
				return "auto-cols"
			case "gridAutoRows":
				return "auto-rows"
			case "gridColumn":
			case "gridColumnStart":
			case "gridColumnEnd":
				return "col-span"
			case "gridRow":
			case "gridRowStart":
			case "gridRowEnd":
				return "row-span"
			case "gridTemplateColumns":
				return "grid-cols"
			case "gridTemplateRows":
				return "grid-rows"
			case "height":
				return "h"
			case "letterSpacing":
				return "tracking"
			case "lineHeight":
				return "leading"
			case "listStyleImage":
				return "list-image"
			case "listStyleType":
				return "list"
			case "margin":
				return "m"
			case "maxHeight":
				return "h-max"
			case "maxWidth":
				return "w-max"
			case "minHeight":
				return "h-min"
			case "minWidth":
				return "w-min"
			case "mexBlendMode":
				return "mix-blend"
			case "objectPosition":
				return "object"
			case "placeholderColor":
				return "placeholder"
			case "ringColor":
			case "ringWidth":
				return "ring"
			case "ringOffsetColor":
			case "ringOffsetWidth":
				return "ring-offset"
			case "padding":
				return "p"
			case "scrollMargin":
				return "scroll-m"
			case "scrollPadding":
				return "scroll-p"
			case "textColor":
				return "text"
			case "textIndent":
				return "indent"
			case "textOpacity":
				return "opacity"
			case "transformOrigin":
				return "origin"
			case "transitionDelay":
				return "delay"
			case "transitionDuration":
				return "duration"
			case "transitionProperty":
				return "transition"
			case "transitionTimingFunction":
				return "ease"
			case "outlineColor":
			case "outlineStyle":
			case "outlineWidth":
				return "outline"
			case "textDecorationColor":
			case "textDecorationStyle":
			case "textDecorationThickness":
				return "decoration"
			case "textUnderlineOffset":
				return "underline-offset"
			case "width":
				return "w"
			case "zIndex":
				return "z"
			default:
				return base.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
		}
	}

	const treeWalker = (node: Node, tag: string) => {
		Array.from(Object.entries(node)).forEach(function callback(nodeOrName) {
			if (typeof nodeOrName[1] == "object") {
				treeWalker(nodeOrName[1], `${tag}-${nodeOrName[0]}`)
			} else {
				if (nodeOrName[0] !== "lineHeight") {
					// @ts-ignore
					const lastSelector: string = tag.split("-").pop()
					let label =
						nodeOrName[0] === "DEFAULT" ||
						["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl"].includes(lastSelector) ||
						[
							"light",
							"normal",
							"regular",
							"medium",
							"bold",
							"italic",
							"sans",
							"serif",
							"lightitalic",
							"regularitalic",
							"mediumitalic",
							"bolditalic",
							"semilight",
							"semiregular",
							"semimedium",
							"semibold",
							"extralight",
							"extraregular",
							"extramedium",
							"extrabold"
						].includes(lastSelector)
							? tag
							: `${tag}-${nodeOrName[0]}`
					entries.push({ label: `${devicePrefix}${label}`, value: nodeOrName[1], property: property })
				}
			}
		})
	}

	Array.from(Object.entries(fullConfig.theme)).forEach(function callback(root, _i) {
		property = root[0]

		const base = baseClass(root[0])
		nodeNames = []
		nodeNames.push(base)
		// @ts-ignore
		treeWalker(root[1], base)
	})
	// Missing padding & margin definitions
	const name = { p: "padding", m: "margin" }
	const position = { t: "Top", l: "Left", b: "Bottom", r: "Right", x: "LeftRight", y: "TopBottom" }
	const spacing = Object.entries(tailwind.defaultTheme.spacing)
	for (const [nameKey, nameValue] of Object.entries(name)) {
		for (const [positionKey, positionValue] of Object.entries(position)) {
			for (const [_spacingKey, spacingValue] of Object.entries(spacing)) {
				entries.push({ label: `${devicePrefix}${nameKey}${positionKey}-${spacingValue[0]}`, value: spacingValue[1], property: `${nameValue}${positionValue}` })
			}
		}
	}
	entries.push({ label: `${devicePrefix}grid`, value: "display:grid", property: "grid" })
	entries.push({ label: `${devicePrefix}flex`, value: "display:flex", property: "flex" })
	entries.push({ label: `${devicePrefix}uppercase`, value: "uppercase", property: "text" })
	entries.push({ label: `${devicePrefix}lowercase`, property: "text" })
	tailwind.suggestions = entries
}
