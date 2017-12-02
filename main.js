const electron = require('electron')
const robot = require('robotjs')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut

const path = require('path')
const url = require('url')

let mainWindow

let enabled = false

function createWindow () {
  mainWindow = new BrowserWindow({width: 225, height: 275})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  // mainWindow.setMenu(null)
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function keyTap(char) {
   if (enabled) {
      robot.keyTap(char)
   }
}

function registerKeys() {
  // globalShortcut.register('Left', () => keyTap('r'))
  // globalShortcut.register('Right', () => keyTap('f'))
  // globalShortcut.register('Space', () => keyTap('p'))
}

function unregisterKeys() {
  // globalShortcut.unregister('Left')
  // globalShortcut.unregister('Right')
  // globalShortcut.unregister('Space')
}

app.on('ready', registerKeys)
app.on('ready', () => {
  // globalShortcut.register('Escape', toggleEnabled)
})
app.on('will-quit', globalShortcut.unregisterAll)

function toggleEnabled(value) {
   enabled = !enabled
   if (enabled) {
     registerKeys()
   } else {
     unregisterKeys()
   }
   return enabled
}

exports.toggleEnabled = toggleEnabled
