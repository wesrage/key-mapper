import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { isSameKey, normalizeKey } from '../util'
import { GLOBAL_TOGGLE_KEY } from './App'
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
      label: PropTypes.string,
      key: PropTypes.string,
      ctrlKey: PropTypes.bool,
      altKey: PropTypes.bool,
      metaKey: PropTypes.bool,
      shiftKey: PropTypes.bool,
    }),
    onCancel: PropTypes.func,
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

  componentWillUnmount() {
    document.removeEventListener('keydown', this.setKey)
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
      const key = e.key
      const ctrlKey = e.ctrlKey
      const altKey = e.altKey
      const metaKey = e.metaKey
      const shiftKey = e.shiftKey
      const keyData = { key, ctrlKey, altKey, metaKey, shiftKey }
      if (!this.state.key) {
        this.setState({ key: normalizeKey(keyData) })
      } else {
        this.setState({ action: normalizeKey(keyData) })
      }
    }
  }

  render() {
    const { key, action } = this.state
    const editingGlobalToggle = key.label === GLOBAL_TOGGLE_KEY
    return (
      <Centered>
        <CenteredText>
          {!key ? (
            <p>Press input key (combination)...</p>
          ) : (
            <div>
              {action && <p>You cannot map a key combination to itself!</p>}
              {editingGlobalToggle ? (
                 <p>Press input key (combination) for {key.label}...</p>
              ) : (
                 <p>Press output key (combination) to trigger for input <KeyDisplay>{key}</KeyDisplay>...</p>
              )}
            </div>
          )}
          <div>
            <button onClick={this.props.onCancel}>Cancel</button>
          </div>
        </CenteredText>
      </Centered>
    )
  }
}
