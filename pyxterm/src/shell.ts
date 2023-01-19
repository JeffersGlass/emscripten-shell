import type { Terminal } from "xterm";
import { Command } from 'commander'

type IDisposable {
    dispose(): void
}
export class Emshell {
    terminal: Terminal
    keyhandler: IDisposable
    FS //Implements the Emscripten Filesystem API
    commands = new Map<String, Command>()
    muteShellLeader = false
    
    currentLine = '';


    constructor (terminal: Terminal, FS) {
        this.terminal = terminal
        this.FS = FS
        this.keyhandler = this.terminal.onKey(this.onKey.bind(this))
        this.makeCommands()
    }

    onKey(e: {key: string, domEvent: KeyboardEvent}, f: void) {
        //console.log(e.key); // getting in browser console but Not in the browser itself
        if (e.domEvent.key === 'Backspace'){
            if (this.currentLine.length > 0){
                this.write('\x1b[D \x1b[D')
                this.currentLine = this.currentLine.substring(0, this.currentLine.length - 1)
            }
        } 
        else if (e.key === '\r'){ //enter pressed
            this.executeLine(this.currentLine)
        } 
        else {
            this.write(e.key);
            this.currentLine += e.key
        }
    }

    write(value: any){
        const output = String(value).replace(/\n/g, '\n\r')
        this.terminal.write(output)
    }

    newConsoleLine(){
        this.currentLine = ''
        this.write('\n')
        this.write('\x1b[93m' + this.linePrefix + '\x1b[0m')
    }

    executeLine(line: String) {
        //Try to execute first token as command
        const tokens = line.split(' ')
        if (this.commands.has(tokens[0])){
            const command = this.commands.get(tokens[0])
            command.parse(tokens.slice(1), {from: 'user'})
        }
        else {
            this.write(`\nNo command found matching '${line}'. Known commands are `)
            this.write(Array.from(this.commands.keys()).join(', '))
            this.newConsoleLine()
        }
    }

    addCommand(name: String, command: Command){
        this.commands.set(name, command)
    }

    restoreShell(){
        this.muteShellLeader = false
        this.terminal.reset()
        this.currentLine = ''
        this.terminal.write(this.linePrefix)
        this.assertKeyHandling()
    }

    assertKeyHandling(){
        console.warn("Terminal handling keys")
        this.keyhandler?.dispose()
        this.keyhandler = this.terminal.onKey(this.onKey.bind(this))
    }

    makeCommands(){
        this.addCommand('ls', new Command().name('ls')
            .description("list files")
            .argument('[path]', 'the path to list files from (optional)')
            .action((path: String, options) => {
                this.write("\n")
                if (!path){
                    path = '.'
                }
                const contents: Array<String> = this.FS.readdir(path)
                contents.forEach(path => {
                    let pre = ''
                    let post = ''
                    const mode = this.FS.stat(path).mode
                    //Color Coding
                    if (this.FS.isFile(mode) && path.substring(path.length-3) == '.py'){
                        pre = '\x1b[93m'
                        post = '\x1b[0m'
                        }
                    else if (this.FS.isDir(mode)){
                        pre = '\x1b[96m'
                        post = '\x1b[0m'
                        }
                    this.write(`${pre}${path}${post}  `)
                    });
                this.newConsoleLine()
                })
            .configureOutput({
                writeOut: (str) => {console.log(str)},
                writeErr: (str) => {console.log(str)},
                getErrHelpWidth: () => {return 40}, //Todo - make this actual terminal width
                getOutHelpWidth: () => {return 40}, //Todo - make this actual terminal width
            })
        )

        this.addCommand('pwd', new Command().name('pwd')
            .description("Gets the current working directory")
            .action((options) => {
                this.write("\n")
                this.write(this.FS.cwd())
                this.newConsoleLine()
            })
            .configureOutput({
                writeOut: (str) => {console.log(str)},
                writeErr: (str) => {console.log(str)},
                getErrHelpWidth: () => {return 40}, //Todo - make this actual terminal width
                getOutHelpWidth: () => {return 40}, //Todo - make this actual terminal width
            })
        )

        this.addCommand('cd', new Command().name('cd')
            .description("Change the current working directory")
            .argument('[path]', 'the directory to change to')
            .action((path: String, options) => {
                if (path && path.substring(0,1) !== '/'){
                    //Preprocess path
                    const pathParts = path.split('/')
                    const usePath = new Array<String>()
                    pathParts.forEach((element, i) => {  
                        if (element == '..') { usePath.push(...pathParts.slice(0, -1))}
                        else if (element = '.') {usePath.push(...pathParts)}
                        else usePath.push(element)
                    });

                    path = pathParts.join('/')
                }

                try {
                    this.FS.chdir(path);
                }
                catch (error) {
                    if (!path) this.write("\nYou must provide a [path] to change to")
                    else this.write(`\nCould not resolve path '${path}'`)
                }
                this.newConsoleLine()
            })
            .configureOutput({
                writeOut: (str) => {console.log(str)},
                writeErr: (str) => {this.write(str)},
                getErrHelpWidth: () => {return 40}, //Todo - make this actual terminal width
                getOutHelpWidth: () => {return 40}, //Todo - make this actual terminal width
            })
        )

        this.addCommand('clear', new Command().name('clear')
            .description('clear the screen')
            .action(() => {
                this.terminal.clear()
                this.newConsoleLine()
            })
        )

        this.addCommand('help', new Command().name('help')
            .description('Get help!')
            .argument('[command]', 'The command to get help with')
            .action((command) => {
                this.write("\n")
                if (command) {
                    this.write(this.commands.get(command).helpInformation())
                }
                else {
                    this.write(`\nKnown commands are `)
                    this.write(Array.from(this.commands.keys()).join(', '))
                }
                this.newConsoleLine()
            })
        )

    }

    get linePrefix() {
        if (this.muteShellLeader) return ''
        else return '\x1b[93m' + this.FS.cwd() + "$ " + '\x1b[0m'
    }
}