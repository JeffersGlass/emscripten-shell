from code import InteractiveConsole
import sys

import js
from pyodide.ffi import to_js

class xtermInteractive(InteractiveConsole):
    def __init__(self, emshell, locals=None, filename="<console>"):
        super().__init__(locals, filename)
        self.emshell = emshell
        self.line = ""
        self.more = 0

    def write(self, data):
        self.emshell.write(data)

    def flush(self):
        # Makes this object file-like to act as sys.stdout and sys.stderr
        pass

    def beginInteraction(self, banner=None, exitmsg = None):
        try:
            sys.ps1    
        except AttributeError:
            sys.ps1 = ">>> "
        try:
            sys.ps2
        except AttributeError:
            sys.ps2 = "... "

        cprt = 'Type "help", "copyright", "credits" or "license" for more information.'
        if banner is None:
            self.write("Python %s on %s\n%s\n(%s)\n" %
                    (sys.version, sys.platform, cprt,
                        self.__class__.__name__))
        elif banner:
            self.write("%s\n" % str(banner))

        sys.stdout = self
        sys.stderr = self

        self.more = 0
        self.write(sys.ps1)

    def endInteraction(self):
        self.emshell.restoreShell()

    #onKey(e: {key: string, domEvent: KeyboardEvent}, f: void)
    def onKey(self, event, f):
        #js.console.log(f"Got key {event.key}")
        #js.console.log(to_js(event.domEvent))
        if event.key == '\r': #Enter
            self.write("\n")
            self.more = self.push(self.line)
            self.line = ''
            if self.more: self.write(sys.ps2)
            else: self.write(sys.ps1)
        elif event.domEvent.ctrlKey and event.domEvent.key == 'c':
            self.endInteraction()
        elif event.domEvent.key == 'Backspace':
            self.line = self.line[:-1]
            self.write('\x1b[D \x1b[D')
        else:
            self.line += event.key
            self.write(event.key)

    def interact(self, banner=None, exitmsg=None):
        more = 0
        while 1:
            try:
                if more:
                    prompt = sys.ps2
                else:
                    prompt = sys.ps1
                try:
                    line = self.raw_input(prompt)
                except EOFError:
                    self.write("\n")
                    break
                else:
                    more = self.push(line)
            except KeyboardInterrupt:
                self.write("\nKeyboardInterrupt\n")
                self.resetbuffer()
                more = 0
        if exitmsg is None:
            self.write('now exiting %s...\n' % self.__class__.__name__)
        elif exitmsg != '':
            self.write('%s\n' % exitmsg)

xtermInteractive