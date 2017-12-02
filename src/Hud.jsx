import PropTypes from 'prop-types'
import React from 'react'
import querystring from 'querystring'
import { ipcRenderer } from 'electron'

export default class Hud extends React.Component {
  state = {
    enabled: querystring.parse(window.location.search),
  }

  componentDidMount() {
    ipcRenderer.on('on', () => {
      this.setState({
        enabled: true,
      })
    })
    ipcRenderer.on('off', () => {
      this.setState({
        enabled: false,
      })
    })
  }

  render() {
    return (
      <div>
        <div
          style={{
            borderRadius: '100%',
            width: 30,
            height: 30,
            background: this.state.enabled ? '#080' : '#aaa',
          }}
        />{' '}
        <span>Key Mapper {this.state.enabled ? 'Enabled' : 'Disabled'}</span>
      </div>
    )
  }
}
