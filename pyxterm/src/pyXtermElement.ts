import "../node_modules/xterm/css/xterm.css"

import { xtermElement, defaultOutputConfig } from "./xtermelement"
import { encodingUTF8 } from "./shell"
import { Command } from "commander"

import interactiveSrc from "./interactive.py"

export { xtermElement } from "./xtermelement"

export class pyscriptXtermElement extends xtermElement {
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
                this.addEventListener('copy', this.blockCopy)
            }
        )

        this.addEventListener('focusout', (event) => 
            {
                this.removeEventListener('copy', this.blockCopy)
            }
        )
    }

    addPythonCommands(pyscriptModule) {
        this.emsh.addCommand('python', new Command().name('python')
            .description("Run the python interpreter")
            .option('-m <path>', "Run the specified python module")
            .action(options => {
                if (options.m){
                    try{
                        const modulesrc = this.emsh.FS.readFile(options.m, encodingUTF8)    
                        pyscriptModule.interpreter.interface.runPython(modulesrc)
                        this.emsh.newConsoleLine()
                    }
                    catch (err) {
                        this.emsh.write(`Could not read source path '${options.m}'`)
                        console.error(err)
                    }

                }
                else {
                    this.emsh.muteShellLeader = true
                    const pyInterpClass = pyscriptModule.interpreter.interface.runPython(interactiveSrc)
                    const pyInterp = pyInterpClass(this.emsh)

                    this.emsh.keyhandler.dispose()
                    pyInterp.beginInteraction()
                    
                    this.emsh.keyhandler = this.emsh.terminal.onKey(pyInterp.onKey)
                }
            })
            .configureOutput(defaultOutputConfig)
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

                    const importlib = pyscriptModule.interpreter.interface.pyimport("importlib")
                    importlib.invalidate_caches()

                    this.emsh.newConsoleLine()
            })
            .configureOutput(defaultOutputConfig)

        this.emsh.addCommand("pip", pip)
    }

    blockCopy(event) {
        event.preventDefault; return false;
    }
}

