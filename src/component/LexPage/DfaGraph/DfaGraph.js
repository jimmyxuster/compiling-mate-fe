import React, { Component } from 'react';
import * as echarts from 'echarts';

let dfaChart;
class DfaGraph extends Component {
  componentDidMount() {
    dfaChart = echarts.init(document.getElementById('dfa_graph'));
    let option = {
      title: {
        text: 'DFA图'
      },
      series: [{
        type: 'graph',
        roam: false,
        layout: 'force',
        animation: false,
        data: [],
        force: {
            // initLayout: 'circular'
            // gravity: 0
            repulsion: 500,
            edgeLength: 100
        },
        edges: [],
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
        lineStyle: {
          normal: {
            opacity: 0.9,
            width: 2,
            curveness: 0.3
          }
        }
      }]
    };
    dfaChart.setOption(option);
  }

  render() {
    if(this.props.data !== undefined && dfaChart !== undefined) {
      let {states, links} = this.props.data;
      let nodes = [];
      let edges = [];
      states.slice(0, this.props.nodeCount).forEach((val, index) => {
        nodes.push({
          name: 'S' + index,
          fixed: false,
          value: val,
          symbolSize:40
        })
      })
      links.slice(0, this.props.edgeCount).forEach(val => {
        edges.push({
          source: val.moveFrom,
          target: val.moveTo,
          label: {
            normal: {
              show: true,
              formatter: 'as'
            }
          },
        })
      })
      dfaChart.setOption({
        series: [{
          data: nodes,
          edges: edges
        }]
      })
    }
    
    return (
    <div id="dfa_graph" style={{height: 300}}/>
    );
  }
}

export default DfaGraph;
