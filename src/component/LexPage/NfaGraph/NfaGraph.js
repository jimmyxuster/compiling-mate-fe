import React, { Component } from 'react';
import * as echarts from 'echarts';

function culPosition(data) {
    let res = {
      nodes: data.nodes,
      links: data.links
    };
    let inDegree = [];
    let outDegree = [];
    let nexts = [];
    let visited = [];

    data.nodes.forEach(val => {
        inDegree[val.id] = 0;
        outDegree[val.id] = 0;
        nexts[val.id] = [];
        visited[val.id] = 0;
    })
    data.links.forEach(val => {
      outDegree[val.from]++;
      inDegree[val.to]++;
      nexts[val.from].push(val.to);
    });
  
  
    let forkDeepStack = [];
    function rec(current, cx, cy, offsety, deep) {
      if(visited[current]) return;
  
      visited[current] = true;

      let temp = res.nodes.find(val => val.id === current);
      temp.x = cx;
      temp.y = cy;
      temp.name = temp.id.toString();


      if(outDegree[current] === 0) return;
  
      if(outDegree[current] === 1) {
        if(inDegree[nexts[current][0]] === 2) {
          if(forkDeepStack[forkDeepStack.length-1] !== deep) {
            rec(nexts[current][0], cx + 100, cy + offsety, deep - 1);
          } else {
            forkDeepStack.pop();
            return;
          }
        } else {
          rec(nexts[current][0], cx + 100, cy, offsety, deep);
        }
      }
  
      if(outDegree[current] === 2) {
        let n1 = nexts[current][0];
        let n2 = nexts[current][1];
        if(visited[n1] || visited[n2]) {
          if(visited[n1]){
            rec(n2, cx + 100, cy, offsety,deep);
            res.links.find(val => val.from === current && val.to === n1).lineStyle = {
                normal: {
                  curveness: 0.5
                }
            }
          }else if(visited[n2]){
            rec(n1, cx + 100, cy, offsety,deep);
            res.links.find(val => val.from === current && val.to === n2).lineStyle = {
                normal: {
                  curveness: 0.5
                }
            }
          }
        } else if(inDegree[n1] === 1 && inDegree[n2] === 1) {
          forkDeepStack.push(deep + 1);
          rec(n1, cx + 100, cy + 0.8*offsety, 0.8 * offsety, deep + 1);
          rec(n2, cx + 100, cy - 0.8*offsety, 0.8 * offsety, deep + 1);
        } else {
          let n;
          n1 > n2 ? n = n2 : n = n1;
          rec(n, cx + 100, cy, offsety, deep);
        }
      }
    }
    rec(res.nodes.find(val => val.start).id, 0, 0, 80, 0);

    res.links.forEach(val => {
        val.source = val.from.toString();
        val.target = val.to.toString();
        val.label = {
            normal: {
              show: true,
              formatter: val.tag ? val.tag : 'ε'
            }
        };
    })
    return res;
  }

let nfaChart;
class NfaGraph extends Component {
  componentDidMount() {
    nfaChart = echarts.init(document.getElementById('nfa_graph'));
    let option = {};
    nfaChart.setOption(option);
  }

  render() {
    let links = [];
    let nodes = [];
    let data = {}
    if(this.props.data){
        data = culPosition(this.props.data);
        links = data.links;
        nodes = data.nodes;
    }
    if(nfaChart !== undefined){
        nfaChart.setOption({
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
                data: nodes,
                edges: links,
                lineStyle: {
                  normal: {
                    opacity: 0.9,
                    width: 2,
                    curveness: 0
                  }
                }
              }
            ]
          });
    }
    
    
    return (
    <div id="nfa_graph" style={{height: 500}}/>
    );
  }
}

export default NfaGraph;
