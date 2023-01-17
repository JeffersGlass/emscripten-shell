import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import { Emshell } from "./shell";
import { parser } from '../grammar/build/emsh.js'

class xtermElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const term = new Terminal({
            allowProposedApi: true,
            cursorBlink: true,
        });
        const emsh = new Emshell(term);  

        const fit = new FitAddon();
        term.loadAddon(fit)

        term.open(this);
        fit.fit();

        term.write("Started Emshell at " + String(new Date()))
        term.write("\r\n")
        term.write(parser.parse("1 + 2 - 4"))
    }
}

export function makeXtermElement(){
    customElements.define("py-xterm", xtermElement)
}