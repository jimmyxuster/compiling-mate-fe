import React from 'react'
import ECharts from 'echarts'

class NodeChart extends React.Component {

    constructor(props) {
        super(props)
        this.directMode = false;
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
                    // roam: true,
                    symbol: 'circle',
                    symbolSize: 25,
                    itemStyle: {
                        color: '#c23631'
                    },
                    symbolRotate: 0,
                    borderColor: '#c23631',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            fontSize: 14,
                            width: 70,
                            align: 'center'
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
                        show: true,
                        alwaysShowContent: true,
                        triggerOn: 'mousemove',
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
        }
        this.onResize = this.onResize.bind(this)
    }

    componentDidMount() {
        this.chart = ECharts.init(this.refs['chart'])
        this.chart.setOption(this.option)
        if (this.pendingData) {
            this.chart.setOption({data: this.pendingData})
            this.pendingData = null
        }
        if (this.pendingLinks) {
            this.chart.setOption({links: this.pendingLinks})
            this.pendingLinks = null
        }
        setTimeout(() => {
            this.onResize()
        }, 0)
        this.chart.on('click', (params) => {
            if (this.props.onClick) {
                this.props.onClick(params)
            }
        })
        window.addEventListener('resize', this.onResize, false)
    }

    componentWillReceiveProps(newProps) {
        if ('data' in newProps) {
            this.option.series[0].data = newProps.data
            this.option.series[0].animation = newProps.data.length >= 3 || (this.props.data && newProps.data.length === 2 && newProps.data.length < this.props.data.length)
            if (this.chart) {
                this.chart.setOption(this.option)
            }
        }
        if ('links' in newProps) {
            this.option.series[0].links = newProps.links
            if (this.chart) {
                this.chart.setOption(this.option)
            }
        }
        if ('directMode' in newProps) {
            this.handleDirectMode(newProps.directMode)
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false)
    }

    onResize() {
        if (this.chart) {
            let {width, height} = this.refs['chart'].getBoundingClientRect()
            this.chart.resize({width, height: height - 40})
        }
    }

    handleDirectMode(checked) {
        if (checked === this.directMode) { return; }
        this.directMode = checked;
        this.option = {
            series: [{
                symbolSize: checked ? 80 : 25,
                itemStyle: {
                    color: checked ? '#fff' : '#c23631'
                },
                borderColor: checked ? 'transparent' : '#c23631',
                label: {
                    normal: {
                        show: true,
                        color: checked ? '#c23631' : '#fff',
                        position: checked ? 'insideLeft' : 'inside',
                        fontSize: checked ? 18 : 14,
                        width: 70,
                        align: checked ? 'left' : 'center',
                        formatter: (params => checked ? params.data.value : params.name),
                    }
                },
                tooltip: {
                    show: !checked,
                    formatter: params => params.value,
                    triggerOn: checked ? 'none' : 'mousemove',
                },
                silent: checked,
            }]
        };
        this.chart.setOption(this.option);
    }

    render() {
        return (
            <div ref="chart" className="slr__chart"/>
        )
    }
}

export default NodeChart