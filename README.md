# py-xterm
A PyScript plugin that adds an interactive terminal to the page

# Compatibility

This plugin is only usable in versions of PyScript after the merge of [PR 1065](https://github.com/pyscript/pyscript/pull/1065) on Janaury 11, 2023. Currently, this is not part of any stable release of PyScript. To try it out, link to the `unstable` release at:

```html
<script defer src="https://pyscript.net/unstable/pyscript.js"></script>
<link rel="stylesheet" href="https://pyscript.net/unstable/pyscript.css">
```
# Usage

After building the plugin from source (see below), in the `<py-config>` section of your PyScript page, include a link to the build verison of this Plugin in `plugins` list.

Once the plugin has initialized, all `<py-xterm>` tags on the page will be linked to individual shells:

```html
<py-config>
    plugins = ["./pyxterm/build/pyxterm.js"]
</py-config>
<py-xterm></py-xterm>
```
# Development
To build this plugin, first clone this repository. 

Then, from the command line, move into the `pyxterm` folder. 

Run `npm install` to install the necessary packages.

Then run `npm run build` to build the plugin (which will be exported to `/build/pyxterm.js`), or `npm run dev` to automatically rebuild the plugin when changes are observed.

## Resources:

- [xtermjs docs](http://xtermjs.org/docs/)

# Prior Art

Some features of this project are inspired by other projects, including:
  - [xterm-js-shell](https://github.com/RangerMauve/xterm-js-shell/blob/master/index.js)
  - [This CodePen](https://codepen.io/iiiiiiiiiiiiiiiiiiiiii/pen/LYRjybP) - Author Unknown
  - [pyTermTk](https://github.com/ceccopierangiolieugenio/pyTermTk)