import React, {Component} from 'react';
import {Row, Col, Input, Button, Card} from 'antd';
import api from '../../service/api';
import TokenList from './Token/TokenList';
import './CoLangPage.css';
const {TextArea} = Input;

class CoLangPage extends Component {
  constructor () {
    super ();
    this.state = {
      code: 'print "hello world";',
      output: [],
      tokens: [],
    };
  }

  onCodeChange = e => {
    const {value} = e.target;
    this.setState ({code: value});
  };

  run = () => {
    api.runCoLangCode ({code: this.state.code}).then (res => {
      if (res.success) {
        let {data} = res;
        this.setState ({
          output: data.output,
          tokens: data.tokens,
        });
      }
    });
  };

  render () {
    return (
      <div className="colang-page-container">
        <Row gutter={16}>
          <Col span={6}>
            <Card title="Code Editor" bordered={false}>
              <TextArea
                placeholder="Enter your colang code here"
                autosize={{minRows: 5}}
                onChange={this.onCodeChange}
                defaultValue={this.state.code}
              />
              <Button type="primary" style={{margin: '8px 0'}} onClick={this.run}>
                Run
              </Button>
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Token List" bordered={false}>
              <TokenList tokens={this.state.tokens} />
            </Card>
          </Col>
          <Col span={6}>
            <Card title="Output" bordered={false}>
              <div className="output-container">
                {this.state.output.map ((val, index) => (
                  <p key={index} style={{margin: 0}}>{val}</p>
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
