import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.132.2/examples/jsm/controls/OrbitControls.js';

export class Renderer3D {
    constructor(container) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.loader = new GLTFLoader();
        
        this.setupLights();
        this.camera.position.z = 5;
        
        this.animate = this.animate.bind(this);
        this.animate();
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
    }

    loadModel(modelPath) {
        return new Promise((resolve, reject) => {
            this.loader.load(modelPath,
                (gltf) => {
                    this.scene.clear();
                    this.scene.add(gltf.scene);
                    resolve(gltf);
                },
                undefined,
                reject
            );
        });
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
} 