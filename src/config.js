export const config = {
	theme: {
		extend: {
			colors: {
				axa: {
					blue: "#00008F",
					"dark-grey": "#343C3D",
					teal: "#027180",
					tosca: "#914146",
					rouge: "#FF1721",
					greyjoy: "#9FBEAF",
					pacific: "#00ADC6",
					dune: "#FCD385",
					apache: "#BC9D45",
					"viridian-green": "#668980",
					azalea: "#E196AA",
					logan: "#9190AC",
					acid: "#F0FF93",
					"aqua-green": "#9FD9B4",
					"coton-candy": "#FAD6DE",
					igloo: "#B5D0EE",
					secondary: "#D24723"
				},
				twitter: {
					blue: "#26a7de"
				},
				facebook: {
					blue: "#1877F2"
				}
			},
			backgroundColor: {
				icon: "rgb(16, 56 79)",
				"white-0.25": "rgba(255, 255, 255, 0.25)",
				"white-0.32": "rgba(255, 255, 255, 0.32)",
				"white-0.5": "rgba(255, 255, 255, 0.50)",
				"white-0.62": "rgba(255, 255, 255, 0.62)",
				"white-0.80": "rgba(255, 255, 255, 0.80)"
			},
			backgroundImage: {
				comminterne: "linear-gradient(180deg, #00ADC6 0%, #00DFFF 100%)",
				commexterne: "linear-gradient(180deg, #9FD9B4 0%, #B6E2C6 100%)",
				benchmarking: "linear-gradient(180deg, #E196AA 0%, #E4ABBB 100%)",
				rse: "linear-gradient(180deg, #FCD385 0%, #FFDFA3 100%)",
				pop: "linear-gradient(0deg, rgba(255,255,255, 0.75) 0%, rgba(255,255,255, 0) 100%)",
				light: "linear-gradient(137.53deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.32) 102.42%)",
				"switch-red": "url(https://axa.buzzcasting.net/storage/axa/images/switch-red.svg)",
				"switch-aqua": "url(https://axa.buzzcasting.net/storage/axa/images/switch-aqua.svg)",
				"img-2": "url(https://axa.buzzcasting.net/storage/axa/images/bg-img-2.jpg)",
				"img-3": "url(https://axa.buzzcasting.net/storage/axa/images/bg-img-3.png)",
				"img-4": "url(https://axa.buzzcasting.net/storage/axa/images/rse.svg)",
				instagram: "url(/storage/axa/images/instagram-bg-blue.svg)",
				twitter: "url(/storage/axa/images/twitter-bg-blue.svg)"
			},
			boxShadow: {
				teal: "inset 0 0 5px 5px rgb(3 100 149 / 60%)",
				icon: "inset 0 0 2px 2px rgba(255,255,255,0.2)"
			},
			flex: {
				flex: {
					legendkey: "0 0 10px",
					legendcount: "0 0 25px"
				}
			},
			fontFamily: {
				italic: ["SourceSansPro-Italic", "serif"],
				sans: ["SourceSansPro-Regular", "serif"],
				"sans-bold": ["Publico-Bold", "sans-serif"],
				"publico-bolditalic": ["Publico-BoldItalic", "serif"],
				"publico-italic": ["Publico-Italic", "serif"],
				"publico-medium": ["Publico-Medium", "serif"],
				"publico-mediumitalic": ["Publico-MediumItalic", "serif"],
				"publico-bold": ["Publico-Bold", "serif"],
				"sourcesanspro-regular": ["SourceSansPro-Regular", "serif"],
				"sourcesanspro-italic": ["SourceSansPro-Italic", "serif"],
				"sourcesanspro-bold": ["SourceSansPro-Bold", "serif"],
				"sourcesanspro-semibold": ["SourceSansPro-SemiBold", "serif"],
				"sourcesanspro-bolditalic": ["SourceSansPro-BoldItalic", "serif"]
			},
			fontSize: {
				xs: ["0.65rem", "0.8rem"]
			},
			width: {
				half: "960px",
				fhd: "1920px",
				"fhd-1/2": "960px",
				contents: "884px"
			},
			height: {
				half: "540px",
				fhd: "1080px",
				"fhd-1/2": "540px",
				contents: "468px",
				br: "472px",
				mr: "340px"
			},
			textShadow: {
				category: "0 0 25px white",
				title: "0 0 10px white",
				message: "0 0 3px black"
			}
		}
	}
	/*plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],*/
}

export const css = `
.typeahead-standalone {
  position: relative;
  width:  100%;
  color: #fff;
  text-align: left;
}

.typeahead-standalone .tt-input {
  width: 100%;
  background: transparent;
  z-index: 1
}

.typeahead-standalone .tt-hint {
  background: #363636;
  color: #fff;
  cursor: default;  
  -webkit-user-select: none;
  user-select: none;
  z-index: 0
}

.typeahead-standalone .tt-list {
  background: #363636;
  border: 1px solid #aaa;
  box-sizing: border-box;
  overflow: auto;
  position: absolute;
  width: 98%;
  z-index: 1000
}

.typeahead-standalone .tt-list.tt-hide {
  display: none
}

.typeahead-standalone .tt-list div[class^=tt-] {
  padding: 5px
}

.typeahead-standalone .tt-list .tt-suggestion.tt-selected,.typeahead-standalone .tt-list .tt-suggestion:hover {
  background: #804f7b;
  cursor: pointer
}

.typeahead-standalone .tt-list .tt-suggestion .tt-highlight {
  font-weight: 900;
  color: #3b97e3;
}

.typeahead-standalone .tt-list .tt-group {
  background: #363636
}
.typeahead-standalone .preview {
  height: 15px;
  width: 15px;
  position: absolute;
  right: 10px;
  border: 1px solid #313131;
}
.typeahead-standalone .property {
  position: absolute;
  min-width: 20px;
  max-width: 150px;
  text-overflow: ellipsis;
  right: 10px;
  color: #aaa;
}
`