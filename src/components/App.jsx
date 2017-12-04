import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import Switch from 'react-toggle-switch'
import { ipcRenderer, remote } from 'electron'
import settings from 'electron-settings'
import os from 'os'
import equals from 'deep-equal'
import MappingTable, { getRowKey } from './MappingTable'
import MappingEditor from './MappingEditor'
import KeyDisplay from './KeyDisplay'
import { Icon, HoverIcon } from './Icon'
import { isMac, isSameKey, normalizeKey } from '../util'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toggle-switch/dist/css/switch.min.css'
import '../css/overrides.css'
const main = remote.require('./main')

const Wrapper = styled.div`
  height: 100vh;
  margin: 0 auto;
  max-width: 700px;
  padding: 1em;
`

const GlobalToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
`

const Status = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`

const GlobalToggleLabel = styled.span`
  margin-right: 0.5em;
`

const GlobalShortcut = styled.div`
  align-items: center;
  display: flex;
`

const AddIconContainer = styled.div`
  margin-top: 0.5em;
`

const AddIconWrapper = styled.span`
  cursor: pointer;

  &:hover {
    color: #080;
  }
`

export const GLOBAL_TOGGLE_KEY = 'global toggle'

const DEFAULT_STATE = {
  enabled: false,
  editing: false,
  failedKeys: [],
  globalToggleKey: null,
  keyMappings: [[{ key: 'Left' }, { key: 'r' }], [{ key: 'Right' }, { key: 'f' }]],
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...DEFAULT_STATE }
    if (settings.has('globalToggleKey')) {
      // this.state.globalToggleKey = settings.get('globalToggleKey')
    }
    if (settings.has('keyMappings')) {
      this.state.keyMappings = settings.get('keyMappings')
    }
  }

  componentDidMount() {
    if (this.state.globalToggleKey) {
      main.registerGlobalKey(this.state.globalToggleKey)
    }
    main.confirmStatus(this.state.enabled)
    ipcRenderer.on('toggle', () => {
      this.toggleEnabled().then(enabled => {
        main.confirmStatus(enabled)
      })
    })
  }

  componentDidUpdate(oldProps, oldState) {
    if (!isSameKey(oldState.globalToggleKey, this.state.globalToggleKey)) {
      settings.set('globalToggleKey', this.state.globalToggleKey)
    }
    if (!equals(oldState.keyMappings, this.state.keyMappings)) {
      settings.set('keyMappings', this.state.keyMappings)
    }
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('toggle')
  }

  addMapping = (rawKey, action) => {
    if (rawKey.label === GLOBAL_TOGGLE_KEY) {
      return this.changeGlobalToggleKey(action)
    }
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

  editGlobalToggle = key => {
    this.setState({
      editing: true,
      editingKey: {
        label: GLOBAL_TOGGLE_KEY,
      },
    })
  }

  changeGlobalToggleKey = action => {
    this.setState(
      {
        editing: false,
        globalToggleKey: action,
      },
      () => {
        const success = main.registerGlobalKey(action)
        if (!success) {
          this.setState({
            failedKeys: [action],
            globalToggleKey: null,
          })
        } else {
          this.setState({
            failedKeys: [],
          })
        }
      },
    )
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

  toggleEnabled = () =>
    new Promise(resolve => {
      this.setState(
        state => ({
          enabled: !state.enabled,
        }),
        () => {
          this.resetHandlers()
          resolve(this.state.enabled)
        },
      )
    })

  render() {
    return (
      <Wrapper>
        {this.state.editing ? (
          <MappingEditor
            keyToMap={this.state.editingKey}
            onCancel={this.cancelEditMapping}
            onComplete={this.addMapping}
          />
        ) : (
          <div>
            <GlobalToggleRow>
              <Status>
                <Switch onClick={this.toggleEnabled} on={this.state.enabled} />
                &nbsp;
                <span>{this.state.enabled ? 'Enabled' : 'Disabled'}</span>
              </Status>
              <GlobalShortcut>
                <GlobalToggleLabel>Global Toggle:</GlobalToggleLabel>
                {this.state.globalToggleKey ? (
                  <KeyDisplay>{this.state.globalToggleKey}</KeyDisplay>
                ) : (
                  <span>None specified</span>
                )}{' '}
                <HoverIcon onClick={this.editGlobalToggle} name="pencil" color="#08f" />
              </GlobalShortcut>
            </GlobalToggleRow>
            <MappingTable
              addMapping={this.addMapping}
              editMapping={this.editMapping}
              keyMappings={this.state.keyMappings}
              removeMapping={this.removeMapping}
            />
            <AddIconContainer>
              <AddIconWrapper onClick={() => this.editMapping()}>
                <Icon name="plus" color="#080" /> Add new mapping
              </AddIconWrapper>
            </AddIconContainer>
            {this.state.failedKeys.map(failedKey => (
              <p key={getRowKey(failedKey)}>
                <Icon name="remove-circle" color="#c00" />
                Failed to bind shortcut <KeyDisplay>{failedKey}</KeyDisplay>
              </p>
            ))}
          </div>
        )}
      </Wrapper>
    )
  }
}
