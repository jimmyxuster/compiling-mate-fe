import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Popover, Tag} from 'antd';

class Token extends Component {
  static defaultProps = {
    token: {
      type: 'UNKNOWN',
      lexeme: null,
      literal: null,
      line: 1,
    },
  };
  render () {
    const {type, lexeme, literal, line} = this.props.token;
    let content = <div>
        <p style={{margin: 0}}>lexeme: {lexeme}</p>
        <p style={{margin: 0}}>literal: {literal}</p>
        <p style={{margin: 0}}>line: {line}</p>
    </div>
    return (
      <Popover content={content}>
        <Tag color="blue">{type}</Tag>
      </Popover>
    );
  }
}

Token.propTypes = {
  token: PropTypes.object,
};

export default Token;
