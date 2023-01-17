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
        const emsh = new Emshell(term, 'none');  

        const fit = new FitAddon();
        term.loadAddon(fit)

        term.open(this);
        fit.fit();

        term.write("Started Emshell at " + String(new Date()))
        term.write("\r\n")
        const test_string = "ls world"
        const parts = test_string.split(' ')
        const command = emsh.commands.get(parts[0])
        command.parse(parts.slice(1), {from: 'user'})
    }
}

export function makeXtermElement(){
    customElements.define("py-xterm", xtermElement)
}