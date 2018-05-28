function drawNfa(chart, data) {
  const graphOption = {
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
        symbolSize: 35,
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
        data: data.nodes,
        links: data.links,
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
  chart.setOption(graphOption);
}

export {drawNfa};