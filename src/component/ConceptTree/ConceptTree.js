import React from 'react';
import * as THREE from '../../common/three';
import {Icon, Button} from 'antd';
import classNames from 'classnames';
import './ConceptTree.css';
import { Spin } from 'antd';
import ECharts from 'echarts';
import mainGraph from './main';
import lexGraph from './lex';
import syntaxGraph from './syntax';
import sematicGraph from './semantic';
import descriptions from './description';


class ConceptTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRunning: true,
            loading: true,
            title: '编译器',
            expanded: false,
            showDescription: false,
            description: '',
            showMainButton: false,
        };
        this.descChartData = {
            lex: lexGraph,
            semantic: sematicGraph,
            syntax: syntaxGraph,
        }
        this.option = {
            title: {
                show: false,
            },
            tooltip: {},
            series: [
                {
                    type: 'graph',
                    layout: 'none',
                    data: [],
                    links: [],
                    symbol: 'rect',
                    symbolSize: [250, 80],
                    itemStyle: {
                        color: 'transparent'
                    },
                    symbolRotate: 0,
                    borderColor: '#c23631',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside',
                            fontSize: 30,
                            width: 250,
                            align: 'center'
                        }
                    },
                    tooltip: {
                        show: false,
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    animation: true,
                    animationDurationUpdate: 700,
                    animationEasingUpdate: 'quinticInOut',
                    lineStyle: {
                        normal: {
                            color: '#fff',
                            opacity: 1,
                            width: 2,
                            curveness: 0
                        }
                    }
                }
            ]
        };
        // this.animate = this.animate.bind(this);
        // this.onResize = this.onResize.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleMainPage = this.handleMainPage.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            // this.initThree();
            this.setState({loading: false});
            this.chart = ECharts.init(this.refs['echart']);
            this.chart.setOption(this.option);
            this.chart.on('click', (params) => this.handleChartClick(params))
        }, 500);
    }

    getContainerRect() {
        let threeRoot = this.refs['window'];
        return threeRoot.getBoundingClientRect();
    }

    initThree() {
        let threeRoot = this.refs['window'];
        let {width, height} = this.getContainerRect();
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
        this.camera.position.set( 0, 0, 1 );
        this.camera.lookAt(0, 0, -500);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.sortObjects = false;
        this.renderer.setClearColor(0xFFFFFF);
        this.renderer.setPixelRatio(width / height);
        threeRoot.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(255, 255, 255);
        this.scene.background = new THREE.CubeTextureLoader()
            .setPath( '/image/' )
            .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
        let dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
        dirLight.position.set( 0, 0, 1 ).normalize();
        this.scene.add(dirLight);
        let pointLight = new THREE.PointLight( 0xffffff, 1.5 );
        pointLight.position.set( 0, 100, 90 );
        this.scene.add(pointLight);
        this.animate();

        window.addEventListener('resize', this.onResize, false);
    }

    // onResize() {
    //     let {width, height} = this.getContainerRect();
    //     this.camera.aspect = width / height;
    //     this.camera.updateProjectionMatrix();
    //     this.renderer.setSize(width, height);
    // }

    // componentWillUnmount() {
    //     window.removeEventListener('resize', this.onResize);
    // }

    // animate() {
    //     if (this.state.isRunning) {
    //         this.renderer.render(this.scene, this.camera);
    //         requestAnimationFrame(this.animate);
    //         TWEEN.update();
    //     }
    // }

    handleExpand() {
        if (!this.state.expanded) {
            this.setState({expanded: true});
            this.showMainConceptChart();
        } else {
            this.showDescriptionChart();
        }
    }

    showMainConceptChart() {
        setTimeout(() => {
            this.chart.resize();
            this.option.series[0].data = mainGraph.data;
            this.option.series[0].links = mainGraph.links;
            this.chart.setOption(this.option);
        }, 0);
    }

    showDescriptionChart() {
        this.option.series[0].data = this.descChartData[this.descValue].data;
        this.option.series[0].links = this.descChartData[this.descValue].links;
        this.chart.setOption(this.option);
        this.setState({
            showDescription: false,
            showMainButton: true,
        });
    }

    handleChartClick(params) {
        console.log(params)
        this.descValue = params.data.value;
        if (this.descValue && this.descValue.length > 0) {
            this.setState({
                title: params.data.name,
                description: descriptions[params.data.value] || 'no description',
                showDescription: true,
            });
        } else if (params.data.link) {
            this.props.history.push(params.data.link);
        }
    }

    handleMainPage() {
        this.setState({
            expanded: false,
            showDescription: false,
            description: '',
            showMainButton: false,
            title: '编译器',
        })
    }

    render() {
        let loading = (<div className="concept-three__loading" style={{opacity: this.state.loading ? 1 : 0}}>
            <Spin size="large"/>
        </div>);
        let titleClass = classNames({'expand': this.state.expanded});
        let iconClass = classNames({'concept-tree__arrow': true, 'expand': this.state.expanded});
        let chartClass = classNames({'concept-tree__echart': true, 'expand': this.state.expanded, 'hidden': this.state.showDescription})
        let descClass = classNames({'concept-tree__desc': true, 'visible': this.state.showDescription});
        let mainButtonClass = classNames({'concept-tree__back': true, 'visible': this.state.showMainButton});

        return (<div ref="window" className="concept-three__wrapper">
            {loading}
            <div className="concept-tree__wrapper" style={{zIndex: this.state.loading ? '0' : '10'}}>
                <p className={titleClass}>{this.state.title}</p>
                <div className={chartClass} ref="echart"/>
                <div className={descClass} ref="description" dangerouslySetInnerHTML={{__html: this.state.description}}/>
                <Icon onClick={this.handleExpand} type="double-right" className={iconClass}/>
                <Button className={mainButtonClass} onClick={this.handleMainPage}><Icon type="left" />返回</Button>
            </div>
        </div>);
    }
}

export default ConceptTree;