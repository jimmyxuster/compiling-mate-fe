import React, { Component } from 'react';
import { Card } from 'antd';
import * as echarts from 'echarts';
class ThompsonCard extends Component {
  componentDidMount() {
    let myChart = echarts.init(document.getElementById('test_echarts'));

    function nodeToString ( node ) {  
        var tmpNode = document.createElement( "div" );  
        tmpNode.appendChild( node.cloneNode( true ) );  
        var str = tmpNode.innerHTML;  
        tmpNode = node = null; // prevent memory leaks in IE  
        return str;  
     }

    let option = {
        title: {
            text: 'RE树'
        },
        tooltip: {},
        series:[
            {
                type: 'tree',

                data: 
                [
                    {
                        name: "r13", 
                        children:
                        [
                            {
                                name: "r5",
                                children: [
                                    {
                                        name: "r3",
                                    },
                                    {
                                        name: "r4"
                                    }
                                ]
                            }, 
                            {name:"|"}, 
                            {name: "r12"}, 
                        ]
                    }
                ],

                left: '2%',
                right: '2%',
                top: '8%',
                bottom: '20%',

                symbol: 'circle',
                symbolSize: 30,

                orient: 'vertical',

                expandAndCollapse: false,

                label: {
                    position: 'inside',
                    normal: {
                        position: 'inside',
                        rotate: 0,
                        verticalAlign: 'middle',
                        align: 'middle',
                        fontSize: 14
                    }
                },

                tooltip: {
                    formatter: function (params, ticket, callback) {
                        console.log(ticket);
                        console.log(params);
                        let opt = {
                            xAxis: {
                                type: 'category',
                                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                            },
                            yAxis: {
                                type: 'value'
                            },
                            series: [{
                                data: [820, 932, 901, 934, 1290, 1330, 1320],
                                type: 'line'
                            }]
                        };
                        let dom = document.getElementById('test');
                        if(dom != null) {
                            let chart = echarts.init(dom);
                            chart.setOption(opt);
                            console.log(nodeToString(dom));
                            return nodeToString(dom);

                        }
                        return "<div id=\"test_tooltip\" style=\"width: 1000px; height:500px\"></div>";
                    }
                },
                leaves: {
                    label: {
                        normal: {
                            symbol: 'circle',
                            position: 'bottom',
                            rotate: 0,
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },

                animationDurationUpdate: 750
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  render() {
    return (
    <Card className="thompson-card" title="Thompson Algorithm" bordered={false}>
      <div id="test_echarts" style={{height: 500}}>
        sss
      </div>
      <div id="test" style={{height: 500}}/>>
    </Card>
    );
  }
}

export default ThompsonCard;
