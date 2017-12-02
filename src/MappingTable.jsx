import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import KeyDisplay, { getModifiers } from './KeyDisplay'

export default class MappingTable extends React.Component {
  static propTypes = {
    addMapping: PropTypes.func,
    editMapping: PropTypes.func,
    keyMappings: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          ctrlKey: PropTypes.bool,
          altKey: PropTypes.bool,
          metaKey: PropTypes.bool,
          shiftKey: PropTypes.bool,
        }),
      ),
    ),
    removeMapping: PropTypes.func,
  }

  render() {
    return (
      <table className="table mapping-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {this.props.keyMappings.map(([key, action]) => (
            <tr key={getRowKey(key)}>
              <td>
                <KeyDisplay>{key}</KeyDisplay>
              </td>
              <td>
                <KeyDisplay>{action}</KeyDisplay>
                <div className="action-icon-container">
                  <i
                    onClick={() => this.props.editMapping(key)}
                    className="edit-icon action-icon glyphicon glyphicon-pencil"
                  />
                  <i
                    onClick={() => this.props.removeMapping(key)}
                    className="remove-icon action-icon glyphicon glyphicon-trash"
                  />
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              <span className="add-icon-wrapper" onClick={() => this.props.editMapping()}>
                <i className="add-icon action-icon glyphicon glyphicon-plus-sign" /> Add
                new mapping
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export function getRowKey(key) {
  return `${getModifiers(key).join('+')}${key.key}`
}
