import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import classnames from 'classnames'

const BaseIcon = styled.i`
  cursor: pointer;
  margin-left: 0.5em;
`

class Glyphicon extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
  }

  render() {
    const { className, name, ...props } = this.props
    const classes = classnames([
      className,
      'glyphicon',
      `glyphicon-${name}`,
    ])
    return <BaseIcon className={classes} {...props} />
  }
}

export const Icon = styled(Glyphicon)`
  color: ${props => props.color};
`

export const HoverIcon = Icon.extend`
  color: initial;

  &:hover {
    color: ${props => props.color};
  }
`
