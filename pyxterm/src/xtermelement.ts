import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import { Emshell } from "./shell";

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
    }
}

export function makeXtermElement(){
    customElements.define("py-xterm", xtermElement)
}