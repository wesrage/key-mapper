import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import os from 'os'

const KeyText = styled.span`
  background: #eee;
  border: 1px solid #aaa;
  border-radius: 3px;
  padding: 3px 5px;
  text-transform: uppercase;
`

export default class KeyDisplay extends React.Component {
  static propTypes = {
    children: PropTypes.shape({
      key: PropTypes.string,
      ctrlKey: PropTypes.bool,
      altKey: PropTypes.bool,
      shiftKey: PropTypes.bool,
      metaKey: PropTypes.bool,
    }),
  }

  render() {
    const modifiers = getModifiers(this.props.children)
    return (
      <span>
        {modifiers.map(modifier => (
          <span key={modifier}>
            <KeyText>{modifier}</KeyText> +{' '}
          </span>
        ))}
        <KeyText>{getKeyText(this.props.children.key)}</KeyText>
      </span>
    )
  }
}

const KEY_TEXT_MAP = {
  Left: '←',
  Right: '→',
  Down: '↓',
  Up: '↑',
  Escape: 'Esc',
}

function getKeyText(key) {
  return !key ? key : KEY_TEXT_MAP[key] || key.toUpperCase()
}

export function getModifiers({ ctrlKey, altKey, shiftKey, metaKey }) {
  const result = []
  if (ctrlKey) {
    result.push('ctrl')
  }
  if (metaKey) {
    if (os.platform() === 'darwin') {
      result.push('⌘')
    } else {
      result.push('⊞')
    }
  }
  if (altKey) {
    result.push('alt')
  }
  if (shiftKey) {
    result.push('shift')
  }
  return result
}
