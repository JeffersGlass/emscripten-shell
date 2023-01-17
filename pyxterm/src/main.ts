import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import "../node_modules/xterm/css/xterm.css"

class PSH {
    terminal: Terminal

    constructor (terminal: Terminal) {
        this.terminal = terminal
        //this.terminal.attachCustomKeyEventHandler(this.onKey)
        this.terminal.onKey(this.onKey.bind(this))
    }

    onKey(e: {key: string, domEvent: KeyboardEvent}, f: void) {
        console.log(e.key); // getting in browser console but Not in the browser itself
        this.terminal.write(e.key)
    }
}

export default class pyXterm {
    afterSetup(runtime) {
        console.warn("RUNNING AFTER SETUP")
        const xterm_elements = document.getElementsByTagName("py-xterm")
        for (const el of xterm_elements){
            const term = new Terminal({
                allowProposedApi: true,
                cursorBlink: true,
            });
            const psh = new PSH(term);  

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