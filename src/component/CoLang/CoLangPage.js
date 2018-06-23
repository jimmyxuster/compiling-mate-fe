import React, {Component} from 'react';
import {Row, Col, Input, Button, Card} from 'antd';
import api from '../../service/api';
import TokenList from './Token/TokenList';
import './CoLangPage.css';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';
import * as echarts from 'echarts';
import Divider from 'antd/lib/divider';

const {TextArea} = Input;

class CoLangPage extends Component {
  constructor() {
    super();
    this.state = {
      code: 'print "hello world"; \nvar a = 1;\nvar b = 2;\nif(a == b) {\n	print "a 等于 b";\n}' +
          ' else {\n	print "a 不等于 b";\n}\nprint (a + b) / a;',
      output: [],
      tokens: [],
      codeMirror: null,
      showResult: false
    };
  }

  onCodeChange = e => {
    const {value} = e.target;
    this.setState({code: value});
  };

  updateTree = () => {
    const treeOption = {
      title: {
        text: '语法树'
      },
      tooltip: {},
      series: [
        {
          type: 'tree',
          data: [
            {
              name: 'Statement',
              children: [
                {
                  name: 'Print',
                  children: [
                    {
                      name: 'Expression',
                      children: [
                        {
                          name: 'hello world'
                        }
                      ]
                    }
                  ]
                },
                {
                  name: 'Statement',
                  children: [
                    {
                      name: 'Var',
                      children: [
                        {
                          name: 'a',
                        },
                        {
                          name: '1'
                        }
                      ]
                    },
                    {
                      name: 'Statement',
                      children: [
                        {
                          name: 'Var',
                          children: [
                            {
                              name: 'b',
                            },
                            {
                              name: '2'
                            }
                          ]
                        },
                        {
                          name: 'Statement',
                          children: [
                            {
                              name: 'If',
                              children: [
                                {
                                  name: 'Condition',
                                },
                                {
                                  name: 'IfBlock',
                                  children: [
                                    {
                                      name: 'Print',
                                      children: [
                                        {
                                          name: 'a 等于 b'
                                        }
                                      ]
                                    }
                                  ]
                                },
                                {
                                  name: 'ElseBlock',
                                  children: [
                                    {
                                      name: 'Print',
                                      children: [
                                        {
                                          name: 'a 不等于 b'
                                        }
                                      ]
                                    }
                                  ]
                                }

                              ]
                            },
                            {
                              name: 'Statement',
                              children: [
                                {
                                  name: 'Print',
                                  children: [
                                    {
                                      name: 'Expression',
                                      children: [
                                        {
                                          name: 'Divide',
                                          children: [
                                            {
                                              name: 'Add',
                                              children: [
                                                {
                                                  name: 'a'
                                                },
                                                {
                                                  name: 'b'
                                                }
                                              ]
                                            },
                                            {
                                              name: 'a'
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  ]
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'circle',
          symbolSize: 1,
          orient: 'vertical',
          expandAndCollapse: false,
          label: {
            position: 'inside',
            normal: {
              position: 'inside',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'middle',
              fontSize: 12
            }
          },
          leaves: {
            label: {
              normal: {
                symbol: 'circle',
                position: 'inside',
                rotate: 0,
                verticalAlign: 'middle',
                align: 'middle'
              }
            }
          },
          animationDurationUpdate: 750
        }
      ]
    };
    this.treeChart = echarts.init(document.getElementById('syntax_tree'));
    if (this.treeChart !== null) {
      this
        .treeChart
        .clear();
      this
        .treeChart
        .setOption(treeOption);
    }
  }

  componentDidMount() {}

  run = () => {
    api
      .runCoLangCode({
      code: this
        .state
        .codeMirror
        .getValue()
    })
      .then(res => {
        if (res.success) {
          let {data} = res;
          this.setState({output: data.output, tokens: data.tokens, showResult: true});
          this.updateTree();
        }
      });
  };

  componentDidMount() {
    this.setState({
      codeMirror: CodeMirror(document.getElementById('colang_editor'), {
        value: this.state.code,
        mode: "javascript",
        lineNumbers: true,
        theme: 'dracula'
      })
    });
  }

  render() {
    return (
      <div className="colang-page-container">
        <Row gutter={16} style={{
          height: '100%'
        }}>
          <Col span={11} offset={1}>
            <div id="colang_editor"></div>
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              style={{
              margin: '100px 0'
            }}
              onClick={this.run}>
              Run
            </Button>
          </Col>
          <Col span={10} style={{
            height: '100%'
          }}>
            {this.state.showResult
              ? <div className="info">
                  <Card className="card" title="Token List" bordered={false}>
                    <TokenList tokens={this.state.tokens}/>
                  </Card>
                  <Card className="card" title="Syntax Tree" bordered={false}>
                    <div id="syntax_tree"/>
                  </Card>
                  <Card className="card" title="Output" bordered={false}>
                    <div className="output-container">
                      {this
                        .state
                        .output
                        .map((val, index) => (
                          <p
                            key={index}
                            style={{
                            margin: 0
                          }}>{val}</p>
                        ))}
                    </div>
                  </Card>
                </div>
              : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CoLangPage;
