# GrapesJS Tailwind Typeahead plugin

Edit your pages using Tailwind CSS classes. Typeahead is included to assist with finding the correct syntax. Validate your choice by using the enter key or choose directly from the suggestions using the cursor keys.

Theme settings and Tailwind CSS directives can be modified from the toolbar and are stored in the GrapesJS configuration

Fonts can be imported using the TW directives and declared for use in the Theme configuration

For working with different screen size, change to the device and start the typeahead suggestions with the modifier ( e.g sm:text-fuchsia-400 )

This plugin will generation most selectors (6000+) but not the base, component and utilities directives classes yet

[DEMO](##)

Find a live demo here [GrapesJS Tailwind CSS Typeahead Demo](https://demo.touchflows.com/twta/index.html)

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<link href="https://unpkg.com/grapesjs-tailwind-typeahead/dist/grapesjs-tailwind-typeahead.min.css" rel="stylesheet">
<script type="module" src="https://unpkg.com/grapesjs"></script>
<script type="module" src="https://unpkg.com/grapesjs-tailwind-typeahead"></script>


<div id="gjs"></div>
```

### JS
```js
// sample theme configuration
const config = {
  content: [],
  theme: {
    extend: {
      colors: {
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
      },
      width: {
        fhd: "1920px",
      },
      height: {
        fhd: "1080px",
      },
    }
  }
}

const directives = 
  `@tailwind base;
  @tailwind components;
  @tailwind utilities;`

const escapeName = (name) => `${name}`.trim().replace(/([^a-z0-9\[\]\w-:/]+)/gi, '-')

const editor = grapesjs.init({
    height: '100%',
    container: '#gjs',
    showOffsets: true,
    fromElement: true,
    noticeOnUnload: false,
    storageManager: false,
    deviceManager: { // standard Tailwind CSS breakpoint
      default: '',
      devices: [
        {
          id: 'desktop',
          name: 'desktop',
          width: '',
        },
        {
          id: 'sm',
          name: 'sm: 640px',
          width: '640px',
          widthMedia: '640px',
          maxWidth: '768px',
        },
        {
          id: 'md',
          name: 'md: 768px',
          width: '768px',
          widthMedia: '768px',
        },
        {
          id: 'lg',
          name: 'lg: 1024px',
          width: '1024px',
          widthMedia: '1024px',
        },
        {
          id: 'xl',
          name: 'xl: 1280px',
          width: '1280px',
          widthMedia: '1280px',
        },
        {
          id: '2xl',
          name: '2xl: 1536px',
          width: '1536px',
          widthMedia: '1536px',
        },
      ],
    },
    styleManager: {
      custom: true,
    },
    selectorManager: {
      escapeName, // suports custom (bracketed) Tailwind instructions 
      componentFirst: true, // allow a per component modification of classes
    },
    plugins: ['grapesjs-tailwind-typeahead'],
    pluginsOpts: {
      'grapesjs-tailwind-typeahead': { /* options */ }
    }
  });
```

### CSS
```css
body, html {
  margin: 0;
  height: 100%;
}
```


## Summary

* Plugin name: `grapesjs-tailwind-typeahead`


## Options

| Option | Description | Default |
|-|-|-
| `config` | Tailwind CSS configuration | {} |
| `directives` | Tailwind CSS directives | `@tailwind base; @tailwind components; @tailwind utilities;` |
| `removeWrapper` | Remove the wrapper (usually body) from html output | true |
| `removeId` | Remove element id from html output | true | 


## Download

* CDN
  * `https://unpkg.com/grapesjs-tailwind-typeahead`
* NPM
  * `npm i grapesjs-tailwind-typeahead`
* GIT
  * `git clone https://github.com/touchflows/grapesjs-tailwind-typeahead.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-tailwind-typeahead.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-tailwind-typeahead'],
      pluginsOpts: {
        'grapesjs-tailwind-typeahead': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-tailwind-typeahead';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-tailwind-typeahead/dist/grapesjs-tailwind-typeahead.min.css';


const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/TouchFlows/grapesjs-tailwind-typeahead.git
$ cd grapesjs-tailwind-typeahead
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm run dev
```

Build the source

```sh
$ npm run build
```



## License

MIT
