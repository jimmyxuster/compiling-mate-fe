const nfa = {
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
    }, {
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
}

const states = [
  [
    0, 1, 2, 4, 7
  ],
  [
    1,
    2,
    3,
    4,
    6,
    7,
    8
  ],
  [
    1,
    2,
    4,
    5,
    6,
    7
  ],
  [
    1,
    2,
    4,
    5,
    7,
    9
  ],
  [
    1,
    2,
    4,
    5,
    6,
    7,
    10
  ]
]

const links = [
  {
    "moveFrom": 0,
    "moveBy": "a",
    "moveTo": 1
  }, {
    "moveFrom": 0,
    "moveBy": "b",
    "moveTo": 2
  }, {
    "moveFrom": 1,
    "moveBy": "a",
    "moveTo": 1
  }, {
    "moveFrom": 1,
    "moveBy": "b",
    "moveTo": 3
  }, {
    "moveFrom": 2,
    "moveBy": "a",
    "moveTo": 1
  }, {
    "moveFrom": 2,
    "moveBy": "b",
    "moveTo": 2
  }, {
    "moveFrom": 3,
    "moveBy": "a",
    "moveTo": 1
  }, {
    "moveFrom": 3,
    "moveBy": "b",
    "moveTo": 4
  }, {
    "moveFrom": 4,
    "moveBy": "a",
    "moveTo": 1
  }, {
    "moveFrom": 4,
    "moveBy": "b",
    "moveTo": 2
  }
]

const dfa = {
  states: states,
  links: links
}
export {nfa, dfa};