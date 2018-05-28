const mockTreeData = [
  {
    name: "r13",
    id: 13,
    children: [
      {
        name: "r5",
        id: 5,
        children: [
          {
            name: "r3",
            id: 3,
            children: [
              {
                name: "a"
              }
            ]
          }, {
            id: 4,
            name: "r4",
            children: [
              {
                name: "r1",
                id: 1,
                children: [
                  {
                    name: "r0",
                    id: 0,
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
                id: 2,
                children: [
                  {
                    name: "c"
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

const mockGraphData = {
  13: {
    nodes: [
      {
        name: '0',
        id: 0,
        x: 100,
        y: 300
      }, {
        name: '1',
        id: 1,
        x: 200,
        y: 300
      }, {
        name: '2',
        id: 2,
        x: 300,
        y: 250
      }, {
        name: '3',
        id: 3,
        x: 400,
        y: 250
      }, {
        name: '4',
        id: 4,
        x: 300,
        y: 350
      }, {
        name: '5',
        id: 5,
        x: 400,
        y: 350
      },{
        name: '6',
        id: 6,
        x: 500,
        y: 300
      }, {
        name: '7',
        id: 7,
        x: 600,
        y: 300
      }, {
        name: '8',
        id: 8,
        x: 700,
        y: 300
      }, {
        name: '9',
        id: 9,
        x: 800,
        y: 300
      }, {
        name: '10',
        id: 10,
        x: 900,
        y: 300
      }
    ],
    links: [
      {
        source: 0,
        target: 1,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 1,
        target: 2,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 2,
        target: 3,
        label: {
          normal: {
            show: true,
            formatter: 'a'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 3,
        target: 6,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 6,
        target: 1,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0.7
          }
        }
      }, {
        source: 0,
        target: 7,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0.5
          }
        }
      }, {
        source: 1,
        target: 4,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 4,
        target: 5,
        label: {
          normal: {
            show: true,
            formatter: 'b'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 5,
        target: 6,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 6,
        target: 7,
        label: {
          normal: {
            show: true,
            formatter: 'ε'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 7,
        target: 8,
        label: {
          normal: {
            show: true,
            formatter: 'a'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 8,
        target: 9,
        label: {
          normal: {
            show: true,
            formatter: 'b'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }, {
        source: 9,
        target: 10,
        label: {
          normal: {
            show: true,
            formatter: 'b'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }
    ]
  },
  0: {
    nodes: [
      {
        name: '9',
        id: 9,
        x: 800,
        y: 300
      }, {
        name: '10',
        id: 10,
        x: 900,
        y: 300
      }
    ],
    links: [
      {
        source: '9',
        target: '10',
        label: {
          normal: {
            show: true,
            formatter: 'b'
          }
        },
        lineStyle: {
          normal: {
            curveness: 0
          }
        }
      }
    ]
  },
}

export {mockTreeData, mockGraphData};