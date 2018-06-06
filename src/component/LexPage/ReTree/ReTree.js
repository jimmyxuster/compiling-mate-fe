import React, { Component } from 'react';
import * as echarts from 'echarts';

let treeChart;
class ReTree extends Component {
    constructor() {
        super();
        this.state = {
            currentTicket: null
        }
    }
    componentDidMount() {
        treeChart = echarts.init(document.getElementById('re_tree'));
        let treeOption = {
            title: {
              text: 'RE树'
            },
            tooltip: {},
            series: [
              {
                type: 'tree',
                data: [],
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
                    // if(ticket !== this.state.currentTicket) {
                    //   console.log(params);
                    //   if(params.data.id !== null) {
                    //     graphChart.setOption(getGraphOption(params.data.id, graphData));
                    //   }
                    //   currentTicket = ticket;
                    // }
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
            <div id="re_tree" style={{height: 500}}/>
        );
    }
    
}

export default ReTree;