import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Token from './Token';

class TokenList extends Component {
  render () {
    let {tokens} = this.props;
    let currentLine = 1;
    let htmls = [];
    for(let i = 0; i < tokens.length; i++){
        if(tokens[i].line !== currentLine){
            htmls.push(<br/>);
            currentLine++;
        }
        htmls.push(<Token token={tokens[i]} />)
    }
    return (
      <div>
        {htmls.map((val, index) => val)}
      </div>
    );
  }
}  
TokenList.defaultProps = {
  tokens: [],
};

TokenList.propTypes = {
  tokens: PropTypes.array,
};

export default TokenList;
