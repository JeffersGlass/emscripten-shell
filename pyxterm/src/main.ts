import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import "../node_modules/xterm/css/xterm.css"

const term = new Terminal();
const fit = new FitAddon();

term.loadAddon(fit)

const target_id = "terminal";
const terminal_element = document.getElementById(target_id);

if (terminal_element){
    term.open(terminal_element);
    fit.fit();
    term.write("Proident irure minim eu nulla reprehenderit.")
}
else{
    console.warn(`No element found with id ${target_id}`);
}