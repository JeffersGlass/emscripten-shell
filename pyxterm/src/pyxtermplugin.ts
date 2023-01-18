import "../node_modules/xterm/css/xterm.css"

import { xtermElement } from "./xtermelement"
import { Command } from "commander"

import pysrc from "./interactive.py"

class pyscriptXtermElement extends xtermElement {
    pyscript //PyScriptApp
    copyBlocker: EventListener | null

    constructor() {
        super()
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addPythonCommands(globalThis['pyscript'])
        this.addEventListener('focusin', (event) => 
            {
                console.log("Adding copy blocker")
                this.addEventListener('copy', this.blockCopy)
            }
        )

        this.addEventListener('focusout', (event) => 
            {
                console.log("Removing copy blocker")
                this.removeEventListener('copy', this.blockCopy)
            }
        )
    }

    addPythonCommands(pyscriptModule) {
        this.emsh.addCommand('python', new Command().name('python')
            .description("Run the python interpreter")
            .action(options => {
                this.emsh.muteShellLeader = true
                const term = this.emsh.terminal
                const pyInterpClass = pyscriptModule.interpreter.interface.runPython(pysrc)
                const pyInterp = pyInterpClass(this.emsh)
                this.emsh.keyhandler.dispose()
                this.emsh.keyhandler = term.onKey(pyInterp.onKey)
                pyInterp.beginInteraction()
                console.warn("Python now handling onkey")
            })
        )
    }

    blockCopy(event) {
        event.preventDefault; return false;
    }
}
export default class pyXtermPlugin {
    afterSetup(runtime) {
        customElements.define("py-xterm", pyscriptXtermElement)
    }
    beforePyScriptExec() { }

    afterPyScriptExec() { }

    afterStartup(runtime) {
    }
}