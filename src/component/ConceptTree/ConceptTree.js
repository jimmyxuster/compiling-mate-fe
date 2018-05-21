import React from 'react';
import * as THREE from '../../common/three';
import conceptTreeNodes from '../../common/concept-tree-nodes';
import TWEEN from '@tweenjs/tween.js';
import './ConceptTree.css';

const FLAG_BACK = -2;
const FLAG_PAGE = -1;

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
        this.meshes = [];
        this.textLoader = new THREE.FontLoader();
        this.initBoxes();
        this.group.position.y = -this.height / 2;
        this.scene.add(this.group);
        // this.textLoader.load('/fonts/optimer_regular.typeface.json', font => {
        //     this.font = font;
        //     this.initNodes();
        // });
    }

    initBoxes(cursor = conceptTreeNodes, nextWidth = 60, lastX = 0, nextY = 0) {
        if (cursor.children && cursor.children.length > 0) {
            let childWidth = nextWidth / cursor.children.length;
            this.height += childWidth / cursor.children.length;
            const startX = lastX - cursor.children.length * childWidth / 2;
            cursor.children.forEach((child, index) => {
                this.addBox(childWidth, child.name, startX + index * childWidth + childWidth / 2, nextY + childWidth / 2,
                    30 - childWidth / 2)
            });
            cursor.children.forEach((child, index) => {
                this.addBox(childWidth, child.name, startX + index * childWidth + childWidth / 2, nextY + childWidth / 2,
                    -30 + childWidth / 2)
            });
            cursor.children.forEach((child, index) => {
                this.initBoxes(child, nextWidth / cursor.children.length, startX + index * childWidth + childWidth / 2,
                    nextY + childWidth)
            })
        }
    }

    addBox(width, text, positionX, positionY, positionZ) {
        let threeRoot = this.refs['window'];
        let [cWidth, cHeight] = [threeRoot.offsetWidth, threeRoot.offsetHeight];
        var geometry = new THREE.BoxGeometry(width, width, width);
        let canvas = document.createElement('canvas');
        canvas.width = cWidth / 60 * width;
        canvas.height = cHeight / 60 * width;
        let ctx = canvas.getContext('2d');
        ctx.font = '60pt Arial';
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        let texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = this.renderer.getMaxAnisotropy();
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var box = new THREE.Mesh( geometry, material );
        box.position.x = positionX;
        box.position.y = positionY;
        box.position.z = positionZ;
        this.group.add(box);
    }

    initThree() {
        let threeRoot = this.refs['window'];
        let [width, height] = [threeRoot.offsetWidth, threeRoot.offsetHeight];
        this.height = 0;
        this.group = new THREE.Group();
        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
        this.camera.position.set( 0, 0, 300 );
        this.camera.lookAt(0, 0, 0);
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
        this.controls = new THREE.OrbitControls(this.camera);
        this.controls.update();
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
        // threeRoot.addEventListener('mousemove', this.onMousemove, false);
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
        let threeRoot = this.refs['window'];
        let [width, height] = [threeRoot.offsetWidth, threeRoot.offsetHeight];
        this.mouse.x = ( event.clientX / width ) * 2 - 1;
        this.mouse.y = - ( (event.clientY - 56) / height ) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects( this.scene.children );
        if (intersects.length > 0 && intersects[0].object.name !== undefined) {
            let { name } = intersects[0].object;
            if (name >= 0) {
                this.indexStack.push(intersects[0].object.name);
                this.initNodes();
            } else if (name === FLAG_PAGE) {
                // TODO: navigate to detail page
            } else if (name === FLAG_BACK) {
                this.indexStack = this.indexStack.slice(0, -1);
                let i = -2;
                while (this.meshes[`${this.indexStack.length}-${i}`] || i < 0) {
                    if (this.meshes[`${this.indexStack.length}-${i}`]) {
                        this.scene.remove(this.meshes[`${this.indexStack.length}-${i}`]);
                        delete this.meshes[`${this.indexStack.length}-${i}`];
                    }
                    i++;
                }
                this.initNodes();
            }
        }
    }

    componentWillUnmount() {
        let threeRoot = this.refs['window'];
        threeRoot.removeEventListener('resize', this.onResize);
        threeRoot.removeEventListener('click', this.onMouseclick);
        threeRoot.removeEventListener('mousemove', this.onMousemove);
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

    clearUnnecessaryMeshes() {
        for (let i = 0; i < this.indexStack.length - 4; i++) {
            let j = -2;
            while (this.meshes[`${i}-${j}`] || j < 0) {
                if (this.meshes[`${i}-${j}`]) {
                    this.scene.remove(this.meshes[`${i}-${j}`]);
                    delete this.meshes[`${i}-${j}`];
                }
                j++;
            }
        }
    }

    addTextMesh(idx, text, name, positions, stepIdx, totalHeight, rotationY) {
        if (this.meshes[stepIdx + '-' + idx] === undefined) {
            // console.log('add mesh: id = ' + idx + ', text = ' + text)
            let textGeo = new THREE.TextGeometry(text, {
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
            textMesh.position.x = positions.x + centerOffset * positions.offsetX;
            textMesh.position.y = -totalHeight / 2 + idx * 60;
            textMesh.position.z = positions.z + centerOffset * positions.offsetZ;
            textMesh.rotation.y = rotationY;
            textMesh.name = name;
            this.scene.add(textMesh);
            // this.scene.add(boundingMesh);
            this.meshes[stepIdx + '-' + idx] = textMesh;
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
        this.cameraRotation = this.cameraRotation || 0;
        if (radian === this.cameraRotation) {
            this.isAnimating = false;
            return;
        }
        let dRotation = radian - this.cameraRotation;
        let originRotation = this.cameraRotation;
        let val = { val: 0 };
        // let from = { x: Math.cos(this.cameraRotation + Math.PI / 2) * 500, z: -Math.sin(this.cameraRotation + Math.PI / 2) * 500};
        // let to = { x: Math.cos(radian + Math.PI / 2) * 500, z: -Math.sin(radian + Math.PI / 2) * 500};
        new TWEEN.Tween(val).to({ val: 1 }, 500).easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
                this.cameraRotation = originRotation + dRotation * val.val;
                this.camera.lookAt(Math.cos(this.cameraRotation + Math.PI / 2) * 500, 0,
                    -Math.sin(this.cameraRotation + Math.PI / 2) * 500);
                this.camera.position.set(-Math.cos(this.cameraRotation + Math.PI / 2) * 2000 * (val.val > 0.5 ? 1 - val.val : val.val), 0,
                    Math.sin(this.cameraRotation + Math.PI / 2) * 2000 * (val.val > 0.5 ? 1 - val.val : val.val))
            })
            .onComplete(() => {
                this.camera.lookAt(Math.cos(radian + Math.PI / 2) * 500, 0, -Math.sin(radian + Math.PI / 2) * 500);
                this.camera.position.set(0, 0, 0);
                this.cameraRotation = radian;
                this.camera.zoom = 5;
                this.isAnimating = false;
            })
            .start();

    }

    animate() {
        if (this.state.isRunning) {
            this.renderer.render(this.scene, this.camera);
            this.controls.update();
            requestAnimationFrame(this.animate);
            TWEEN.update();
        }
    }

    render() {
        return <div ref="window" className="concept-three__wrapper"/>;
    }
}

export default ConceptTree;