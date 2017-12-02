import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
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
      keys: {},
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
    if (this.state.key && this.state.action) {
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
    const IGNORE_KEYS = ['Control', 'Alt', 'Shift', 'Meta']
    if (!IGNORE_KEYS.includes(e.key)) {
      const { key, ctrlKey, altKey, metaKey, shiftKey } = e
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
            Press key (combination) to trigger for <KeyDisplay>{key}</KeyDisplay>
          </CenteredText>
        )}
      </Centered>
    )
  }
}
