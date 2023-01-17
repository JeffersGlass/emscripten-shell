import "../node_modules/xterm/css/xterm.css"

import { makeXtermElement } from "./xtermelement"

window['process'] = {
    stdout: {
        write: (str) => {console.log(str)}
    },
    stderr: {
        write: (str) => {console.error(str)}
    }
}

export default class pyXtermPlugin {
    afterSetup(runtime) {
        console.warn("RUNNING AFTER SETUP")
        makeXtermElement()
    }
    beforePyScriptExec(){}

    afterPyScriptExec(){}
    
    afterStartup(runtime){
    } 
}