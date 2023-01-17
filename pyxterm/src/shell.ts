import type { Terminal } from "xterm";
import { Command } from 'commander'


export class Emshell {
    terminal: Terminal
    FS
    commands: Map<String, Command>

    constructor (terminal: Terminal, FS) {
        this.terminal = terminal
        this.FS = FS
        this.terminal.onKey(this.onKey.bind(this))
        this.commands =  this.makeCommands()
    }

    onKey(e: {key: string, domEvent: KeyboardEvent}, f: void) {
        //console.log(e.key); // getting in browser console but Not in the browser itself
        if (e.domEvent.key === 'Backspace') this.write('\x1b[D \x1b[D')
        else if (e.key === '\r') this.write('\r\n')
        else this.write(e.key);
    }

    write(value: any){
        const output = String(value).replace(/\n/g, '\n\r')
        this.terminal.write(output)
    }

    makeCommands() : Map<String, Command>{
        const commands = new Map();
        commands.set('ls', new Command().name('ls')
            .description("list files")
            .argument('[path], the path to list files from (optional)')
            .action((path, options) => {
                console.log(`The path was ${path}`)
                })
            .configureOutput({
                writeOut: (str) => {console.log(str)},
                writeErr: (str) => {console.log(str)},
                getErrHelpWidth: () => {return 40}, //Todo - make this actual terminal width
                getOutHelpWidth: () => {return 40}, //Todo - make this actual terminal width
            })
        )

        commands.set('cwd', new Command().name('cwd')
            .description("Gets the current working directory")
            .action((options) => {
                this.write(this.FS.cwd())
            })
        )

        return commands
    }
}