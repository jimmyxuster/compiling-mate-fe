import React from 'react'
import ECharts from 'echarts'

class NodeChart extends React.Component {

    constructor(props) {
        super(props)
        this.option = {
            title: {
                text: 'SLR演示'
            },
            tooltip: {},
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    data: [],
                    links: [],
                    roam: true,
                    symbolSize: 25,
                    symbolRotate: 0,
                    borderColor: '#fa541c',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    edgeLabel: {
                        normal: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    },
                    tooltip: {
                        formatter: params => params.value
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    animation: false,
                    animationDurationUpdate: 700,
                    animationEasingUpdate: 'quinticInOut',
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
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        this.chart = ECharts.init(this.refs['chart'])
        this.chart.setOption(this.option);
        if (this.pendingData) {
            this.chart.setOption({data: this.pendingData});
            this.pendingData = null;
        }
        if (this.pendingLinks) {
            this.chart.setOption({links: this.pendingLinks});
            this.pendingLinks = null;
        }
        setTimeout(() => {
            this.chart.resize();
        }, 0);
        window.addEventListener('resize', this.onResize, false)
    }

    componentWillReceiveProps(newProps) {
        if ('data' in newProps) {
            this.option.series[0].data = newProps.data;
            this.option.series[0].animation = newProps.data.length >= 3 || (this.props.data && newProps.data.length === 2 && newProps.data.length < this.props.data.length);
            if (this.chart) {
                this.chart.setOption(this.option);
            }
        }
        if ('links' in newProps) {
            this.option.series[0].links = newProps.links;
            if (this.chart) {
                this.chart.setOption(this.option);
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false)
    }

    onResize() {
        if (this.chart) {
            let {width, height} = this.refs['chart'].getBoundingClientRect()
            this.chart.resize({width, height})
        }
    }

    render() {
        return (
            <div ref="chart" className="slr__chart"/>
        )
    }
}

export default NodeChart