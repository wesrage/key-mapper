import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Switch from 'react-toggle-switch'
import { remote } from 'electron'
import os from 'os'
import MappingTable, { getRowKey } from './MappingTable'
import MappingEditor from './MappingEditor'
import KeyDisplay from './KeyDisplay'
import { isSameKey, normalizeKey } from './util'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toggle-switch/dist/css/switch.min.css'
import './app.scss'
const main = remote.require('./main')

const Wrapper = styled.div`
  height: 100vh;
  margin: 0 auto;
  max-width: 700px;
  padding: 0.5em;
`

const Status = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`

export default class App extends React.Component {
  state = {
    enabled: false,
    editing: false,
    failedKeys: [],
    keyMappings: [
      [{ key: 'Left' }, { key: 'r' }],
      [{ key: 'Right' }, { key: 'f' }],
      [{ key: 'Space' }, { key: 'p' }],
    ],
  }

  addMapping = (rawKey, action) => {
    let statePatch = {
      editing: false,
    }
    const key = normalizeKey(rawKey)
    const existingMappingIndex = this.state.keyMappings.reduce(
      (result, [mappedKey, mappedAction], index) => {
        if (isSameKey(key, mappedKey)) {
          return index
        }
        return result
      },
      -1,
    )
    if (existingMappingIndex === -1) {
      statePatch = {
        ...statePatch,
        keyMappings: [...this.state.keyMappings, [key, action]],
      }
    } else {
      statePatch = {
        ...statePatch,
        keyMappings: [
          ...this.state.keyMappings.slice(0, existingMappingIndex),
          [key, action],
          ...this.state.keyMappings.slice(existingMappingIndex + 1),
        ],
      }
    }
    this.setState(statePatch, this.resetHandlers)
  }

  editMapping = key => {
    this.setState({
      editing: true,
      editingKey: key,
    })
  }

  cancelEditMapping = () => {
    this.setState({
      editing: false,
      editingKey: undefined,
    })
  }

  removeMapping = rawKey => {
    const key = normalizeKey(rawKey)
    this.setState(
      state => ({
        keyMappings: state.keyMappings.filter(
          ([mappedKey]) => !isSameKey(key, mappedKey),
        ),
      }),
      this.resetHandlers,
    )
  }

  resetHandlers = () => {
    const failedKeys = main.registerKeys(this.state.keyMappings)
    if (failedKeys.length > 0) {
      this.setState({
        failedKeys,
        keyMappings: this.state.keyMappings.filter(
          ([mappedKey]) => !failedKeys.some(failedKey => isSameKey(failedKey, mappedKey)),
        ),
      })
    } else {
      this.setState({ failedKeys: [] })
    }
    if (!this.state.enabled) {
      main.unregisterKeys()
    }
  }

  toggleEnabled = () => {
    this.setState(
      state => ({
        enabled: !state.enabled,
      }),
      this.resetHandlers,
    )
  }

  render() {
    return (
      <Wrapper>
        {this.state.editing ? (
          <MappingEditor keyToMap={this.state.editingKey} onComplete={this.addMapping} />
        ) : (
          <div>
            <Status>
              <Switch onClick={this.toggleEnabled} on={this.state.enabled} />
              &nbsp;
              <span>{this.state.enabled ? 'Enabled' : 'Disabled'}</span>
            </Status>
            <MappingTable
              addMapping={this.addMapping}
              editMapping={this.editMapping}
              keyMappings={this.state.keyMappings}
              removeMapping={this.removeMapping}
            />
            {this.state.failedKeys.map(failedKey => (
              <p key={getRowKey(failedKey)}>
                <i className="error-icon glyphicon glyphicon-remove-circle" />
                Failed to bind shortcut <KeyDisplay>{failedKey}</KeyDisplay>
              </p>
            ))}
          </div>
        )}
      </Wrapper>
    )
  }
}
