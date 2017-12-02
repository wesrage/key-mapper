import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const KeyText = styled.span`
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.75em;
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
        {getKeyText(this.props.children.key)}
      </span>
    )
  }
}

const KEY_TEXT_MAP = {
  ' ': 'Space',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  ArrowDown: 'Down',
  ArrowUp: 'Up',
}

function getKeyText(key) {
  return KEY_TEXT_MAP[key] || key.toUpperCase()
}

function getModifiers({ ctrlKey, altKey, shiftKey, metaKey }) {
  const result = []
  if (ctrlKey) {
    result.push('ctrl')
  }
  if (metaKey) {
    result.push('⌘')
  }
  if (altKey) {
    result.push('alt')
  }
  if (shiftKey) {
    result.push('shift')
  }
  return result
}
