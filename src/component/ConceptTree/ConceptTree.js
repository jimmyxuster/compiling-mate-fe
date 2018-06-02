import React from 'react';
import * as THREE from '../../common/three';
import {Icon} from 'antd';
import conceptTreeNodes from '../../common/concept-tree-nodes';
import classNames from 'classnames';
import TWEEN from '@tweenjs/tween.js';
import './ConceptTree.css';
import { Spin } from 'antd';
import ECharts from 'echarts';
import mainGraph from './main';
import descriptions from './description';

const FLAG_BACK = -2;
const FLAG_PAGE = -1;

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
        };
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
        this.animate = this.animate.bind(this);
        // this.onMouseclick = this.onMouseclick.bind(this);
        this.onResize = this.onResize.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        // this.onMousemove = this.onMousemove.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.initThree();
            this.setState({loading: false});
            this.chart = ECharts.init(this.refs['echart']);
            this.chart.setOption(this.option);
            this.chart.on('click', (params) => this.handleChartClick(params))
            // this.indexStack = [0];
            // this.meshes = [];
            // this.textLoader = new THREE.FontLoader();
            // this.textLoader.load('/fonts/optimer_regular.typeface.json', font => {
            //     this.font = font;
            //     this.initNodes();
            //     this.setState({loading: false});
            // });
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
        this.mouse = new THREE.Vector2();
        this.animate();

        // this.textMaterial = [
        //     new THREE.MeshLambertMaterial( { color: 0xffffff, flatShading: true, } ), // front
        //     new THREE.MeshLambertMaterial( { color: 0xffffff, } ) // side
        // ];
        // this.textMaterialHover = [
        //     new THREE.MeshLambertMaterial( { color: 0xffff00, flatShading: true, } ), // front
        //     new THREE.MeshLambertMaterial( { color: 0xffff00, } ) // side
        // ];
        //
        // this.raycaster = new THREE.Raycaster();

        window.addEventListener('resize', this.onResize, false);
        // threeRoot.addEventListener('click', this.onMouseclick, false);
        // threeRoot.addEventListener('mousemove', this.onMousemove, false);
    }

    onResize() {
        let {width, height} = this.getContainerRect();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // onMouseclick(event) {
    //     if (this.isAnimating) { return; }
    //     let {width, height} = this.getContainerRect();
    //     this.mouse.x = ( event.clientX / width ) * 2 - 1;
    //     this.mouse.y = - ( (event.clientY - 64) / height ) * 2 + 1;
    //     this.raycaster.setFromCamera( this.mouse, this.camera );
    //
    //     // calculate objects intersecting the picking ray
    //     let intersects = this.raycaster.intersectObjects( this.scene.children );
    //     if (intersects.length > 0 && intersects[0].object.name !== undefined) {
    //         let { name } = intersects[0].object;
    //         if (name >= 0) {
    //             this.indexStack.push(intersects[0].object.name);
    //             this.initNodes();
    //         } else if (name === FLAG_PAGE) {
    //             // TODO: navigate to detail page
    //         } else if (name === FLAG_BACK) {
    //             this.indexStack = this.indexStack.slice(0, -1);
    //             let i = -2;
    //             while (this.meshes[`${this.indexStack.length}-${i}`] || i < 0) {
    //                 if (this.meshes[`${this.indexStack.length}-${i}`]) {
    //                     this.scene.remove(this.meshes[`${this.indexStack.length}-${i}`]);
    //                     delete this.meshes[`${this.indexStack.length}-${i}`];
    //                 }
    //                 i++;
    //             }
    //             this.initNodes();
    //         }
    //     }
    // }

    componentWillUnmount() {
        let threeRoot = this.refs['window'];
        window.removeEventListener('resize', this.onResize);
        // threeRoot.removeEventListener('click', this.onMouseclick);
        // threeRoot.removeEventListener('mousemove', this.onMousemove);
    }

    initNodes() {
        this.isAnimating = true;
        let cursor = conceptTreeNodes;
        let positions = [
            { x: 0, y: 0, z: -500, offsetX: 1, offsetZ: 0, },
            { x: 500, y: 0, z: 0, offsetX: 0, offsetZ: 1, },
            { x: 0, y: 0, z: 500, offsetX: -1, offsetZ: 0, },
            { x: -500, y: 0, z: 0, offsetX: 1, offsetZ: 0, },
        ];
        let rotationYs = [0, -Math.PI / 2, Math.PI, Math.PI / 2,];
        let stepCount = this.indexStack.length;
        this.clearUnnecessaryMeshes();
        this.indexStack.forEach((index, stepIdx) => {
            cursor = cursor.children[index];
            if (cursor.children && cursor.children.length > 0) {
                let childrenCount = cursor.children.length;
                let totalHeight = 60 * childrenCount;
                if (stepIdx >= stepCount - 4) {
                    if (stepIdx > 0) {
                        this.addTextMesh(-1, 'Back', FLAG_BACK, Object.assign({}, positions[stepIdx % 4], {y: -totalHeight / 2 - 60}), stepIdx, totalHeight, rotationYs[stepIdx % 4]);
                    }
                    let globalIdx = stepIdx;
                    stepIdx %= 4;
                    cursor.children.forEach((item, idx) => {
                        this.addTextMesh(idx, item.name, item.children.length > 0 ? idx : FLAG_PAGE, positions[stepIdx], globalIdx, totalHeight, rotationYs[stepIdx]);
                    });
                }
            }
        });
        // console.log(this.meshes);
        this.panTo(-(this.indexStack.length - 1) * Math.PI / 2);
    }

    // clearUnnecessaryMeshes() {
    //     for (let i = 0; i < this.indexStack.length - 4; i++) {
    //         let j = -2;
    //         while (this.meshes[`${i}-${j}`] || j < 0) {
    //             if (this.meshes[`${i}-${j}`]) {
    //                 this.scene.remove(this.meshes[`${i}-${j}`]);
    //                 delete this.meshes[`${i}-${j}`];
    //             }
    //             j++;
    //         }
    //     }
    // }

    // addTextMesh(idx, text, name, positions, stepIdx, totalHeight, rotationY) {
    //     if (this.meshes[stepIdx + '-' + idx] === undefined) {
    //         // console.log('add mesh: id = ' + idx + ', text = ' + text)
    //         let textGeo = new THREE.TextGeometry(text, {
    //             font: this.font,
    //             size: 40,
    //             height: 20,
    //             curveSegments: 4,
    //             bevelThickness: 2,
    //             bevelSize: 1.5,
    //             bevelEnabled: true,
    //         });
    //         textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    //         textGeo.computeBoundingBox();
    //         textGeo.computeVertexNormals();
    //         // let boundingGeo = new THREE.CubeGeometry(textGeo.boundingBox.max.x - textGeo.boundingBox.min.x,
    //         //     40, 20);
    //         // let boundingMesh = new THREE.Mesh(boundingGeo, new THREE.MeshBasicMaterial());
    //         let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    //         let textMesh = new THREE.Mesh(textGeo, this.textMaterial);
    //         textMesh.position.x = positions.x + centerOffset * positions.offsetX;
    //         textMesh.position.y = -totalHeight / 2 + idx * 60;
    //         textMesh.position.z = positions.z + centerOffset * positions.offsetZ;
    //         textMesh.rotation.y = rotationY;
    //         textMesh.name = name;
    //         this.scene.add(textMesh);
    //         // this.scene.add(boundingMesh);
    //         this.meshes[stepIdx + '-' + idx] = textMesh;
    //     }
    // }
    //
    // onMousemove(event) {
    //     let {width, height} = this.getContainerRect();
    //     this.mouse.x = ( event.clientX / width ) * 2 - 1;
    //     this.mouse.y = - ( (event.clientY - 64) / height ) * 2 + 1;
    //     this.raycaster.setFromCamera( this.mouse, this.camera );
    //
    //     let intersects = this.raycaster.intersectObjects( this.scene.children );
    //     if (intersects.length > 0 && intersects[0].object.name !== undefined) {
    //         if (this.INTERSECTED !== intersects[0].object) {
    //             if (this.INTERSECTED) {
    //                 this.INTERSECTED.material = this.textMaterial;
    //             }
    //             this.INTERSECTED = intersects[0].object;
    //             this.INTERSECTED.material = this.textMaterialHover;
    //         }
    //     } else {
    //         if (this.INTERSECTED) this.INTERSECTED.material = this.textMaterial;
    //         this.INTERSECTED = null;
    //     }
    // }
    //
    // panTo(radian) {
    //     this.cameraRotation = this.cameraRotation || 0;
    //     let from = { x: Math.cos(this.cameraRotation + Math.PI / 2) * 500, z: -Math.sin(this.cameraRotation + Math.PI / 2) * 500};
    //     let to = { x: Math.cos(radian + Math.PI / 2) * 500, z: -Math.sin(radian + Math.PI / 2) * 500};
    //     new TWEEN.Tween(from).to(to, 500).easing(TWEEN.Easing.Quadratic.Out)
    //         .onUpdate(() => this.camera.lookAt(from.x, 0, from.z))
    //         .onComplete(() => {
    //             this.camera.lookAt(to.x, 0, to.z);
    //             this.cameraRotation = radian;
    //             this.isAnimating = false;
    //         })
    //         .start();
    //
    // }

    animate() {
        if (this.state.isRunning) {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animate);
            TWEEN.update();
        }
    }

    handleExpand() {
        if (this.state.expanded) { return; }
        this.setState({expanded: true});
        this.showMainConceptChart();
    }

    showMainConceptChart() {
        setTimeout(() => {
            this.chart.resize();
            this.option.series[0].data = mainGraph.data;
            this.option.series[0].links = mainGraph.links;
            this.chart.setOption(this.option);
        }, 0);
    }

    handleChartClick(params) {
        const value = params.data.value;
        if (value && value.length > 0) {
            this.setState({
                title: params.data.name,
                description: descriptions[params.data.value] || 'no description',
                showDescription: true,
            });
        }
    }

    render() {
        let loading = (<div className="concept-three__loading" style={{opacity: this.state.loading ? 1 : 0}}>
            <Spin size="large"/>
        </div>);
        let titleClass = classNames({'expand': this.state.expanded});
        let iconClass = classNames({'concept-tree__arrow': true, 'expand': this.state.expanded});
        let chartClass = classNames({'concept-tree__echart': true, 'expand': this.state.expanded, 'hidden': this.state.showDescription})
        let descClass = classNames({'concept-tree__desc': true, 'visible': this.state.showDescription});

        return (<div ref="window" className="concept-three__wrapper">
            {loading}
            <div className="concept-tree__wrapper" style={{zIndex: this.state.loading ? '0' : '10'}}>
                <p className={titleClass}>{this.state.title}</p>
                <div className={chartClass} ref="echart"/>
                <div className={descClass} ref="description" dangerouslySetInnerHTML={{__html: this.state.description}}/>
                <Icon onClick={this.handleExpand} type="double-right" className={iconClass}/>
            </div>
        </div>);
    }
}

export default ConceptTree;