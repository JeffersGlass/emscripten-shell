import type { Terminal } from "xterm";

export class Emshell {
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