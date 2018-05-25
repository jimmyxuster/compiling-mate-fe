import React, {Component} from 'react';
import {Card, Row, Col} from 'antd';
import * as echarts from 'echarts';
class ThompsonCard extends Component {
  
  componentDidMount() {
    let treeChart = echarts.init(document.getElementById('re_tree'));
    let graphChart = echarts.init(document.getElementById('thompson_graph'));
    let counter = 0;
    const mockTreeData = [
      {
        name: "r13",
        children: [
          {
            name: "r5",
            children: [
              {
                name: "r3",
                children: [
                  {
                    name: "a"
                  }
                ]
              }, {
                name: "r4",
                children: [
                  {
                    name: "r1",
                    children: [
                      {
                        name: "r0",
                        children: [
                          {
                            name: "b"
                          }
                        ]
                      }, {
                        name: "*"
                      }
                    ]
                  }, {
                    name: "r2",
                    children: [
                      {
                        name: "r2",
                        children: [
                          {
                            name: "c"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }, {
            name: "|"
          }, {
            name: "r12",
            children: [
              {
                name: "r11",
                children: [
                  {
                    name: "b"
                  }
                ]
              }, {
                name: "r10",
                children: [
                  {
                    name: "("
                  }, {
                    name: "r9",
                    children: [
                      {
                        name: "r7",
                        children: [
                          {
                            name: "b"
                          }
                        ]
                      }, {
                        name: "|"
                      }, {
                        name: "r8",
                        children: [
                          {
                            name: "r6",
                            children: [
                              {
                                name: "c"
                              }
                            ]
                          }, {
                            name: "*"
                          }
                        ]
                      }
                    ]
                  }, {
                    name: ")"
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    let treeOption = {
      title: {
        text: 'RE树'
      },
      tooltip: {},
      series: [
        {
          type: 'tree',
          data: mockTreeData,
          left: '2%',
          right: '2%',
          top: '8%',
          bottom: '20%',
          symbol: 'circle',
          symbolSize: 24,
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
          tooltip: {
            formatter: function (params, ticket, callback) {
              let graphOption = {
                title: {
                  text: 'NFA图'
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                  {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: true,
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    edgeSymbol: [
                      'circle', 'arrow'
                    ],
                    edgeSymbolSize: [
                      4, 10
                    ],
                    edgeLabel: {
                      normal: {
                        textStyle: {
                          fontSize: 12
                        }
                      }
                    },
                    data: [
                      {
                        name: '节点1',
                        x: 300,
                        y: 700
                      }, {
                        name: '节点2',
                        x: 2000,
                        y: 400
                      }, {
                        name: '节点3',
                        x: 550,
                        y: 300
                      }, {
                        name: '节点4',
                        x: 800,
                        y: 200
                      }
                    ],

                    links: [
                      {
                        source: 0,
                        target: 1,
                        symbolSize: [
                          5, 20
                        ],
                        label: {
                          normal: {
                            show: true,
                            formatter: ticket
                          }
                        },
                        lineStyle: {
                          normal: {
                            width: 5,
                            curveness: 0.2
                          }
                        }
                      }, {
                        source: '节点1',
                        target: '节点3'
                      }, {
                        source: '节点2',
                        target: '节点3'
                      }, {
                        source: '节点2',
                        target: '节点4'
                      }, {
                        source: '节点1',
                        target: '节点4'
                      }
                    ],
                    lineStyle: {
                      normal: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                      }
                    }
                  }
                ]
              };
              let graphOption2 = {
                title: {
                  text: 'NFA图'
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                  {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: true,
                    label: {
                      normal: {
                        show: true
                      }
                    },
                    edgeSymbol: [
                      'circle', 'arrow'
                    ],
                    edgeSymbolSize: [
                      4, 10
                    ],
                    edgeLabel: {
                      normal: {
                        textStyle: {
                          fontSize: 12
                        }
                      }
                    },
                    data: [
                      {
                        name: '节点1',
                        x: 300,
                        y: 300
                      }, {
                        name: '节点2',
                        x: 2000,
                        y: 300
                      }, 
                      {
                        name: '节点3',
                        x: 8000,
                        y: 400
                      }
                    ],

                    links: [
                      {
                        source: 0,
                        target: 1,
                        symbolSize: [
                          5, 20
                        ],
                        label: {
                          normal: {
                            show: true,
                            formatter: ticket
                          }
                        },
                        lineStyle: {
                          normal: {
                            width: 5,
                            curveness: 0.2
                          }
                        }
                      }, {
                        source: '节点1',
                        target: '节点3'
                      }, {
                        source: '节点2',
                        target: '节点3'
                      }
                    ],
                    lineStyle: {
                      normal: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0
                      }
                    }
                  }
                ]
              };
              if(counter % 2 === 1) {
                graphChart.setOption(graphOption);
              } else {
                graphChart.setOption(graphOption2);
              }
              counter++;
              return "";
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

    treeChart.setOption(treeOption);
  }

  render() {
    return (
      <Card className="thompson-card" title="Thompson Algorithm" bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <div id="re_tree" style={{
              height: 500
            }}/>
          </Col>
          <Col span={16}>
            <div id="thompson_graph" style={{
              height: 500
            }}/>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ThompsonCard;