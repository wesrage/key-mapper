import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import equals from 'deep-equal'
import Switch from 'react-toggle-switch'
import { remote } from 'electron'
import MappingTable from './MappingTable'
import MappingEditor from './MappingEditor'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toggle-switch/dist/css/switch.min.css'
import './app.scss'
const main = remote.require('./main')

const Wrapper = styled.div`
  height: 100vh;
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
    keyMappings: [
      [{ key: 'ArrowLeft' }, { key: 'r' }],
      [{ key: 'ArrowRight' }, { key: 'f' }],
      [{ key: ' ' }, { key: 'p' }],
    ],
  }

  addMapping = (key, action) => {
    this.setState({
      editing: false,
    })
    const existingMappingIndex = this.state.keyMappings.reduce(
      (result, [mappedKey, mappedAction], index) => {
        if (equals(key, mappedKey)) {
          return index
        }
        return result
      },
      -1,
    )
    if (existingMappingIndex === -1) {
      this.setState(state => ({
        ...state,
        keyMappings: [...this.state.keyMappings, [key, action]],
      }))
    } else {
      this.setState(state => ({
        ...state,
        keyMappings: [
          ...this.state.keyMappings.slice(0, existingMappingIndex),
          [key, action],
          ...this.state.keyMappings.slice(existingMappingIndex + 1),
        ],
      }))
    }
  }

  editMapping = key => {
    if (key !== undefined) {
      this.setState({ editing: key })
    } else {
      this.setState({ editing: true })
    }
  }

  removeMapping = key => {
    this.setState(
      state => ({
        ...state,
        keyMappings: state.keyMappings.filter(([mappedKey]) => !equals(key, mappedKey)),
      }),
      this.resetHandlers,
    )
  }

  resetHandlers = () => {}

  toggleEnabled = () => {
    this.setState(state => ({
      enabled: !state.enabled,
    }))
  }

  render() {
    return (
      <Wrapper>
        {this.state.editing ? (
          <MappingEditor keyToMap={this.state.editing} onComplete={this.addMapping} />
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
          </div>
        )}
      </Wrapper>
    )
  }
}
