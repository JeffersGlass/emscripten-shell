import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import "../node_modules/xterm/css/xterm.css"

export default class pyXterm {
    afterSetup(runtime) {
        const xterm_elements = document.getElementsByTagName("py-xterm")
        for (const el of xterm_elements){
            const term = new Terminal({
                allowProposedApi: true,
                cursorBlink: true,
            });
            const fit = new FitAddon();
            term.loadAddon(fit)
            term.open(el as HTMLElement);
            fit.fit();
            term.write("Proident irure minim eu nulla reprehenderit.")
            console.log("Made new console")
        }
        
    }
    beforePyScriptExec(){}
    afterPyScriptExec(){}
    afterStartup(runtime){
    } 
}