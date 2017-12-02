const electron = require('electron')
const robot = require('robotjs')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut

const path = require('path')
const url = require('url')

let mainWindow

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

function keyToElectronShortcut(key) {
  const modifiers = []
  if (key.ctrlKey) {
    modifiers.push('Ctrl')
  }
  if (key.altKey) {
    modifiers.push('Alt')
  }
  if (key.metaKey) {
    modifiers.push('Super')
  }
  if (key.shiftKey) {
    modifiers.push('Shift')
  }
  if (modifiers.length > 0) {
    return `${modifiers.join('+')}+${key.key}`
  }
  return key.key
}

function keyToRobotCommand(key, action) {
  const keyHasModifiers = key.ctrlKey || key.altKey || key.metaKey
  const modifiers = []
  if (action.ctrlKey) {
    modifiers.push('control')
  }
  if (action.altKey) {
    modifiers.push('alt')
  }
  if (action.metaKey) {
    modifiers.push('command')
  }
  if (action.shiftKey) {
    modifiers.push('shift')
  }
  return () => {
    const waitDuration = keyHasModifiers ? 500 : 0
    setTimeout(() => {
      robot.keyTap(action.key, modifiers)
    }, waitDuration)
  }
}

function registerKeys(keyMappings) {
  unregisterKeys()
  const failedMappings = keyMappings.map(([key, action]) => {
    const electronShortcut = keyToElectronShortcut(key)
    const robotCommand = keyToRobotCommand(key, action)
    const registered = globalShortcut.register(electronShortcut, robotCommand)
    return registered ? null : key
  })
  return failedMappings.filter(mapping => mapping !== null)
}

function unregisterKeys() {
  globalShortcut.unregisterAll()
}

app.on('ready', () => {
  // globalShortcut.register('Escape', toggleEnabled)
})
app.on('will-quit', globalShortcut.unregisterAll)

exports.registerKeys = registerKeys
exports.unregisterKeys = unregisterKeys
