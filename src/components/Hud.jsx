import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import 'bootstrap/dist/css/bootstrap.min.css'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  height: 50px;
`

const StatusLight = styled.div`
  background: ${props => (props.on ? '#0d0' : '#888')};
  border-color: ${props => (props.on ? '#0f0' : '#444')};
  border-radius: 100%;
  border-style: solid;
  border-width: 1px;
  box-shadow: ${props => (props.on ? '0 0 20px 10px #afa' : 'none')};
  display: inline-block;
  height: 20px;
  margin: 1em;
  width: 20px;
`

export default class Hud extends React.Component {
  state = {
    enabled: false,
  }

  componentDidMount() {
    ipcRenderer.on('hud-toggle-on', () => {
      this.setState({ enabled: true })
    })
    ipcRenderer.on('hud-toggle-off', () => {
      this.setState({ enabled: false })
    })
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('hud-toggle-on')
    ipcRenderer.removeAllListeners('hud-toggle-off')
  }

  render() {
    return (
      <Wrapper>
        <StatusLight on={this.state.enabled} />{' '}
        <span>Key Mapper {this.state.enabled ? 'Enabled' : 'Disabled'}</span>
      </Wrapper>
    )
  }
}
