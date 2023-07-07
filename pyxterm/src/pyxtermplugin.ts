import { pyscriptXtermElement } from "./pyXtermElement"

export default class pyXtermPlugin {
    afterSetup(runtime) {
        customElements.define("py-xterm", pyscriptXtermElement)
    }
    beforePyScriptExec() { }

    afterPyScriptExec() { }

    afterStartup(runtime) {
    }
}