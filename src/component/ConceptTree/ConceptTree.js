import React from 'react';
import THREE from '../../common/three';
import conceptTreeNodes from '../../common/concept-tree-nodes';
import './ConceptTree.css';

class ConceptTree extends React.Component {

    componentDidMount() {
        this.initThree();
        this.indexStack = [0];
        this.meshes = [];
        this.initBubbles();
    }

    initThree() {
        let threeRoot = this.refs['window'];
        let {width, height} = threeRoot.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        this.camera.position.z = 0;
        this.camera.lookAt(0, 0, -10000);
        this.renderer = new THREE.WebGLRenderer({antialias: false, alpha: true});
        this.renderer.setSize(width, height);
        this.renderer.sortObjects = false;
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(width / height);
        threeRoot.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x05050c, 0.0005);
        this.scene.background = new THREE.CubeTextureLoader()
            .setPath( '/image/' )
            .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
        let light = new THREE.AmbientLight(0xFFFFFF, 1);
        this.scene.add(light);
        this.animate();

        this.bubbleGeometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
        this.bubbleMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: this.scene.background, refractionRatio: 0.95 } );
        this.bubbleMaterial.envMap.mapping = THREE.CubeRefractionMapping;
    }

    initBubbles() {
        let cursor = conceptTreeNodes;
        let depth = 0;
        let radius = 0;
        let dRadius = 50 / .7;
        this.indexStack.forEach(index => {
            if (cursor.children && cursor.children.length > 0) {
                cursor = cursor.children[index];
                cursor.children.forEach((item, idx) => {
                    if (this.meshes[depth + '-' + idx] === undefined) {
                        let mesh = new THREE.Mesh(this.bubbleGeometry, this.bubbleMaterial);
                        mesh.position.x = radius * Math.cos(idx * 30 * Math.PI / 180);
                        mesh.position.y = radius * Math.sin(idx * 30 * Math.PI / 180);
                        this.scene.add(mesh);
                        this.meshes[depth + '-' + idx] = mesh;
                    }
                });
            }
            radius += dRadius * .7;
            depth++;
        });
    }

    animate() {
        if (this.state.isRunning) {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.animate);
        }
    }

    render() {
        return <div className="concept-three__wrapper"/>;
    }
}