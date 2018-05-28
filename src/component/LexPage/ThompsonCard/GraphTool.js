let currentTicket = null;

function setTreeAndGraph(treeData, graphData, treeChart, graphChart) {
  let treeOption = {
    title: {
      text: 'RE树'
    },
    tooltip: {},
    series: [
      {
        type: 'tree',
        data: treeData,
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
            if(ticket !== currentTicket) {
              console.log(params);
              if(params.data.id !== null) {
                graphChart.setOption(getGraphOption(params.data.id, graphData));
              }
              currentTicket = ticket;
            }
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

function getGraphOption(key, graphData) {
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
        data: graphData[key].nodes,
        links: graphData[key].links,
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
  return graphOption;
}



export default setTreeAndGraph;