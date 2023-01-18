import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import { Emshell } from "./shell";
import { Command } from "commander";

export class xtermElement extends HTMLElement {
    FS //Implements the Emscripten Filesystem API
    emsh: Emshell

    constructor() {
        super();
    }

    connectedCallback() {
        const term = new Terminal({
            allowProposedApi: true,
            cursorBlink: true,
        });

        const fsName = this.getAttribute("FS")
        let FS
        if (fsName){
            FS = eval(fsName)
        }
        else {
            throw new EvalError(`${fsName} is not a valid JS object in global scope`)
        }

        this.emsh = new Emshell(term, FS);  

        const fit = new FitAddon();
        term.loadAddon(fit)

        term.open(this);
        fit.fit();

        this.emsh.write("Started Emshell at " + String(new Date()))
        this.emsh.newConsoleLine()        
    }
}