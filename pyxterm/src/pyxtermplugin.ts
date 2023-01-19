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
                const pyInterpClass = pyscriptModule.interpreter.interface.runPython(pysrc)
                const pyInterp = pyInterpClass(this.emsh)

                this.emsh.keyhandler.dispose()
                pyInterp.beginInteraction()
                
                this.emsh.keyhandler = this.emsh.terminal.onKey(pyInterp.onKey)
                console.warn("Python now handling onkey")
            })
        )

        const pip = new Command().name('pip')
            .description("Install new packages")

        pip.command('install')
            .argument('[packages...]', 'the packages to be installed')
            .action((packages) => {
                    pyscriptModule.interpreter.interface.loadPackage(
                        packages,
                        (str) => {this.emsh.write(str + "\n")},
                        (str) => {this.emsh.write(str + "\n")}
                        )

                    this.emsh.newConsoleLine()
            })

        this.emsh.addCommand("pip", pip)
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