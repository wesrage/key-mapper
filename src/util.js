import os from 'os'

const KEY_NAME_MAP = {
  ' ': 'Space',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  ArrowDown: 'Down',
  ArrowUp: 'Up',
}

export function normalizeKey(key) {
  return {
    ...key,
    key: normalizeKeyName(key.key),
  }
}

function normalizeKeyName(keyName) {
  return KEY_NAME_MAP[keyName] || keyName
}

export function isSameKey(key1, key2) {
  return (
    key1 &&
    key2 &&
    key1.key === key2.key &&
    !!key1.ctrlKey === !!key2.ctrlKey &&
    !!key1.altKey === !!key2.altKey &&
    !!key1.metaKey === !!key2.metaKey &&
    !!key1.shiftKey === !!key2.shiftKey
  )
}

export function isMac() {
  return os.platform() === 'darwin'
}
