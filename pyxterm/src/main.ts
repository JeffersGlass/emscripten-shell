import { Terminal } from 'xterm'
import "../node_modules/xterm/css/xterm.css"

const term = new Terminal();
const target_id = "terminal";

const terminal_element = document.getElementById(target_id);
if (terminal_element){
    term.open(terminal_element);
}
else{
    console.warn(`No element found with id ${target_id}`);
}