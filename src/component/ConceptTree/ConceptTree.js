import React from 'react';
import * as THREE from '../../common/three';
import conceptTreeNodes from '../../common/concept-tree-nodes';
import TWEEN from '@tweenjs/tween.js';
import './ConceptTree.css';

class ConceptTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isRunning: true,
        };
        this.animate = this.animate.bind(this);
        this.onMouseclick = this.onMouseclick.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onMousemove = this.onMousemove.bind(this);
    }

    componentDidMount() {
        this.initThree();
        this.indexStack = [0];
        this.meshes = [0];
        this.textLoader = new THREE.FontLoader();
        this.textLoader.load('/fonts/optimer_regular.typeface.json', font => {
            this.font = font;
            this.initNodes();
        });
    }

    initThree() {
        let threeRoot = this.refs['window'];
        let [width, height] = [threeRoot.offsetWidth, threeRoot.offsetHeight];
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
        this.camera.position.set( 0, 0, 1 );
        this.camera.lookAt(0, 0, -500);
        console.log(this.camera);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.sortObjects = false;
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(width / height);
        threeRoot.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
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

        this.textMaterial = [
            new THREE.MeshLambertMaterial( { color: 0xffffff, flatShading: true, } ), // front
            new THREE.MeshLambertMaterial( { color: 0xffffff, } ) // side
        ];
        this.textMaterialHover = [
            new THREE.MeshLambertMaterial( { color: 0xffff00, flatShading: true, } ), // front
            new THREE.MeshLambertMaterial( { color: 0xffff00, } ) // side
        ];

        this.raycaster = new THREE.Raycaster();

        threeRoot.addEventListener('resize', this.onResize, false);
        threeRoot.addEventListener('click', this.onMouseclick, false);
        threeRoot.addEventListener('mousemove', this.onMousemove, false);
    }

    onResize() {
        let threeRoot = this.refs['window'];
        let [width, height] = [threeRoot.offsetWidth, threeRoot.offsetHeight];

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onMouseclick(event) {
        if (this.isAnimating) { return; }
        this.isAnimating = true;
        let threeRoot = this.refs['window'];
        let [width, height] = [threeRoot.offsetWidth, threeRoot.offsetHeight];
        this.mouse.x = ( event.clientX / width ) * 2 - 1;
        this.mouse.y = - ( (event.clientY - 56) / height ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects( this.scene.children );
        if (intersects.length > 0 && intersects[0].object.name !== undefined && intersects[0].object.name >= 0) {
            this.indexStack.push(intersects[0].object.name);
            console.log(this.indexStack)
            this.initNodes();
        }
    }

    componentWillUnmount() {
        let threeRoot = this.refs['window'];
        threeRoot.removeEventListener('resize', this.onResize);
        threeRoot.removeEventListener('click', this.onMouseclick);
        threeRoot.removeEventListener('mousemove', this.onMousemove);
    }

    initNodes() {
        let cursor = conceptTreeNodes;
        let depth = 0;
        let positions = [
            { x: 0, y: 0, z: -500, offsetX: 1, offsetZ: 0, },
            { x: 500, y: 0, z: 0, offsetX: 0, offsetZ: 1, },
            { x: 0, y: 0, z: 500, offsetX: -1, offsetZ: 0, },
            { x: -500, y: 0, z: 0, offsetX: 1, offsetZ: 0, },
        ];
        let rotationYs = [0, -Math.PI / 2, Math.PI, -Math.PI / 2,];
        let stepCount = this.indexStack.length;
        this.indexStack.forEach((index, stepIdx) => {
            cursor = cursor.children[index];
            console.log('cursor', cursor)
            if (cursor.children && cursor.children.length > 0) {
                let childrenCount = cursor.children.length;
                let totalHeight = 60 * childrenCount;
                if (stepIdx >= stepCount - 4) {
                    cursor.children.forEach((item, idx) => {
                        this.addTextMesh(depth, idx, item, positions, stepIdx, totalHeight, rotationYs);
                    });
                }
            }
            depth++;
        });
        console.log(this.meshes);
        this.panTo(-(this.indexStack.length - 1) * Math.PI / 2);
    }

    addTextMesh(depth, idx, item, positions, stepIdx, totalHeight, rotationYs) {
        if (this.meshes[depth + '-' + idx] === undefined) {
            let textGeo = new THREE.TextGeometry(item.name, {
                font: this.font,
                size: 40,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: true,
            });
            textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();
            // let boundingGeo = new THREE.CubeGeometry(textGeo.boundingBox.max.x - textGeo.boundingBox.min.x,
            //     40, 20);
            // let boundingMesh = new THREE.Mesh(boundingGeo, new THREE.MeshBasicMaterial());
            let centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
            let textMesh = new THREE.Mesh(textGeo, this.textMaterial);
            textMesh.position.x = positions[stepIdx].x + centerOffset * positions[stepIdx].offsetX;
            textMesh.position.y = -totalHeight / 2 + idx * 60;
            textMesh.position.z = positions[stepIdx].z + centerOffset * positions[stepIdx].offsetZ;
            textMesh.rotation.y = rotationYs[stepIdx];
            textMesh.name = item.children.length > 0 ? idx : -1;
            this.scene.add(textMesh);
            // this.scene.add(boundingMesh);
            this.meshes[depth + '-' + idx] = textMesh;
        }
    }

    onMousemove(event) {
        let threeRoot = this.refs['window'];
        let [width, height] = [threeRoot.offsetWidth, threeRoot.offsetHeight];
        this.mouse.x = ( event.clientX / width ) * 2 - 1;
        this.mouse.y = - ( (event.clientY - 56) / height ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );

        let intersects = this.raycaster.intersectObjects( this.scene.children );
        if (intersects.length > 0 && intersects[0].object.name !== undefined) {
            if (this.INTERSECTED !== intersects[0].object) {
                console.log(intersects);
                if (this.INTERSECTED) {
                    this.INTERSECTED.material = this.textMaterial;
                }
                this.INTERSECTED = intersects[0].object;
                this.INTERSECTED.material = this.textMaterialHover;
            }
        } else {
            if (this.INTERSECTED) this.INTERSECTED.material = this.textMaterial;
            this.INTERSECTED = null;
        }
    }

    panTo(radian) {
        let from = { x: Math.cos(this.camera.rotation.y + Math.PI / 2) * 500, z: -Math.sin(this.camera.rotation.y + Math.PI / 2) * 500};
        let to = { x: Math.cos(radian + Math.PI / 2) * 500, z: -Math.sin(radian + Math.PI / 2) * 500};
        new TWEEN.Tween(from).to(to, 500).easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => this.camera.lookAt(from.x, 0, from.z))
            .onComplete(() => {
                this.camera.lookAt(to.x, 0, to.z);
                this.isAnimating = false;
            })
            .start();

    }

    animate() {
        if (this.state.isRunning) {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animate);
            TWEEN.update();
        }
    }

    render() {
        return <div ref="window" className="concept-three__wrapper"/>;
    }
}

export default ConceptTree;