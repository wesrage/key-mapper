import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { isSameKey, normalizeKeyName } from './util'
import KeyDisplay from './KeyDisplay'

const Centered = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`

const CenteredText = styled.span`
  text-align: center;
`

const IGNORE_KEYS = [
  'control',
  'alt',
  'shift',
  'meta',
  'audiovolumeup',
  'audiovolumedown',
  'audiovolumemute',
]

export default class MappingEditor extends React.Component {
  static propTypes = {
    keyToMap: PropTypes.shape({
      key: PropTypes.string,
      ctrlKey: PropTypes.bool,
      altKey: PropTypes.bool,
      metaKey: PropTypes.bool,
      shiftKey: PropTypes.bool,
    }),
    onComplete: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      key: props.keyToMap,
      action: null,
    }
  }

  componentDidMount() {
    this.initMode()
  }

  componentDidUpdate() {
    this.initMode()
  }

  initMode = () => {
    document.removeEventListener('keydown', this.setKey)
    if (
      this.state.key &&
      this.state.action &&
      !isSameKey(this.state.key, this.state.action)
    ) {
      this.props.onComplete(this.state.key, this.state.action)
    } else {
      this.listenForKey()
    }
  }

  listenForKey = () => {
    document.addEventListener('keydown', this.setKey)
  }

  setKey = e => {
    e.preventDefault()
    if (!IGNORE_KEYS.includes(e.key.toLowerCase())) {
      const key = normalizeKeyName(e.key)
      const ctrlKey = e.ctrlKey
      const altKey = e.altKey
      const metaKey = e.metaKey
      const shiftKey = e.shiftKey
      const keyData = { key, ctrlKey, altKey, metaKey, shiftKey }
      if (!this.state.key) {
        this.setState({ key: keyData })
      } else {
        this.setState({ action: keyData })
      }
    }
  }

  render() {
    const { key, action } = this.state
    return (
      <Centered>
        {!key ? (
          <CenteredText>Press key (combination) for key</CenteredText>
        ) : (
          <CenteredText>
            {action && <p>You cannot map a key combination to itself!</p>}
            Press key (combination) to trigger for <KeyDisplay>{key}</KeyDisplay>
          </CenteredText>
        )}
      </Centered>
    )
  }
}
