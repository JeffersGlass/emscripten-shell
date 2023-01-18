import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import { Emshell } from "./shell";
import { Command } from "commander";

class xtermElement extends HTMLElement {
    FS

    constructor() {
        super();
        const fsName = this.getAttribute("FS")
        if (fsName){
            this.FS = eval(fsName)
            console.log(this.FS)
        }
        else {
            throw new EvalError(`${fsName} is not a valid JS object in global scope`)
        }
    }

    connectedCallback() {
        const term = new Terminal({
            allowProposedApi: true,
            cursorBlink: true,
        });
        const emsh = new Emshell(term, this.FS);  

        const fit = new FitAddon();
        term.loadAddon(fit)

        term.open(this);
        fit.fit();

        emsh.write("Started Emshell at " + String(new Date()))
        emsh.newConsoleLine()        
    }
}

export function makeXtermElement(){
    customElements.define("py-xterm", xtermElement)
}