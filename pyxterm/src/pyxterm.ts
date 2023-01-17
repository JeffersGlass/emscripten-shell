import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import "../node_modules/xterm/css/xterm.css"

import { Emshell } from './shell'

export default class pyXterm {
    afterSetup(runtime) {
        console.warn("RUNNING AFTER SETUP")
        const xterm_elements = document.getElementsByTagName("py-xterm")
        for (const el of xterm_elements){
            const term = new Terminal({
                allowProposedApi: true,
                cursorBlink: true,
            });
            const psh = new Emshell(term);  

            const fit = new FitAddon();
            term.loadAddon(fit)

            term.open(el as HTMLElement);
            fit.fit();
            term.write(String(new Date()))
            term.write("\r\n")
        }
        
    }
    beforePyScriptExec(){}

    afterPyScriptExec(){}
    
    afterStartup(runtime){
    } 
}