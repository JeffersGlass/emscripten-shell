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

        let FS

        const fsName = this.getAttribute("FS")        
        if (fsName){
            FS = eval(fsName)
        }
        else if('pyscript' in globalThis){
            FS = globalThis['pyscript'].interpreter.interface.FS
        }
        else {
            throw new EvalError(`Filesystem could not be indentified from FS=${fsName} or PyScript default`)
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