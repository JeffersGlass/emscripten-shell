import "../node_modules/xterm/css/xterm.css"

import { makeXtermElement } from "./xtermelement"

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