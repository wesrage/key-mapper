import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import { Icon, HoverIcon } from './Icon'
import KeyDisplay, { getModifiers } from './KeyDisplay'

const ActionIconContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  display: none;
  float: right;
`

const Table = styled.table`
  table-layout: fixed;

  tr:hover ${ActionIconContainer} {
    display: block;
  }
`

const NoMappingsMessage = styled.p`
  margin-top: 1em;
  text-align: center;
`

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
    return this.props.keyMappings.length > 0 ? (
      <Table className="table table-striped">
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
                <ActionIconContainer>
                  <HoverIcon
                    onClick={() => this.props.editMapping(key)}
                    color="#08f"
                    name="pencil"
                  />
                  <HoverIcon
                    onClick={() => this.props.removeMapping(key)}
                    color="#c00"
                    name="trash"
                  />
                </ActionIconContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <NoMappingsMessage>No key mappings</NoMappingsMessage>
    )
  }
}

export function getRowKey(key) {
  return `${getModifiers(key).join('+')}${key.key}`
}
