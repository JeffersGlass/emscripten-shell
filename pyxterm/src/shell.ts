import type { Terminal } from "xterm";
import { makeParser } from './commandparser'

export class Emshell {
    terminal: Terminal
    commandParser

    constructor (terminal: Terminal) {
        this.terminal = terminal
        this.terminal.onKey(this.onKey.bind(this))
        this.commandParser = makeParser()
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
}