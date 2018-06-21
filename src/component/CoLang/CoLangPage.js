import React, {Component} from 'react';
import {Row, Col, Input, Button, Card} from 'antd';
import api from '../../service/api';
import TokenList from './Token/TokenList';
import './CoLangPage.css';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';
const {TextArea} = Input;

class CoLangPage extends Component {
  constructor() {
    super();
    this.state = {
      code: 'print "hello world";',
      output: [],
      tokens: [],
      codeMirror: null
    };
  }

  onCodeChange = e => {
    const {value} = e.target;
    this.setState({code: value});
  };

  run = () => {
    api
      .runCoLangCode({code: this.state.codeMirror.getValue()})
      .then(res => {
        if (res.success) {
          let {data} = res;
          this.setState({output: data.output, tokens: data.tokens});
        }
      });
  };

  componentDidMount() {
    this.setState({
      codeMirror: CodeMirror(document.getElementById ('colang_editor'), {
        value: this.state.code,
        mode:  "javascript",
        lineNumbers: true,
        theme: 'dracula'
      })
    });
  }

  render() {
    return (
      <div className="colang-page-container">
        <div id="colang_editor"></div>
        <Row gutter={16}>
          <Col span={6} offset={3}>
            <Card title="Code Editor" bordered={false}>
              <TextArea
                placeholder="Enter your colang code here"
                autosize={{
                minRows: 5
              }}
                onChange={this.onCodeChange}
                defaultValue={this.state.code}/>
              <Button
                type="primary"
                style={{
                margin: '8px 0'
              }}
                onClick={this.run}>
                Run
              </Button>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Token List" bordered={false}>
              <TokenList tokens={this.state.tokens}/>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Output" bordered={false}>
              <div className="output-container">
                {this
                  .state
                  .output
                  .map((val, index) => (
                    <p key={index} style={{
                      margin: 0
                    }}>{val}</p>
                  ))}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CoLangPage;
