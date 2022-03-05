import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

export default class Viewer {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.grid = new THREE.GridHelper(1000, 1000);
        this.stats = new Stats();

        this.renderer.setSize(this.width, this.height);

        this.stars = this.createStars();

        // Camera position
        this.camera.position.set(99,23,-14);
        
        this.scene.add(this.grid)
        this.scene.add(this.stars);

        document.body.appendChild(this.stats.dom);

        this.sun = this.createSun();
        this.planets = this.createPlanets();

        this.addLight();

        this.animate();

        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }

    createSun() {
        const sun = this.createSphereWithTexture('sun', 2);
        
        this.scene.add(sun);

        return sun;
    }

    createPlanets() {
        const planets = [];
        
        const mercury = this.createSphereWithTexture('mercury', .125);
        const venus = this.createSphereWithTexture('venus', .375);
        const earth = this.createSphereWithTexture('earth',.38);
        const mars = this.createSphereWithTexture('mars', .20);
        const jupyter = this.createSphereWithTexture('jupyter', 4);
        const saturn = this.createSphereWithTexture('saturn',3.25);
        const uranus = this.createSphereWithTexture('uranus', 1.35);
        const neptune = this.createSphereWithTexture('neptune',1.35);


        let zInit = -5;

        mercury.position.set(0, 0, zInit);
        zInit -= 5;
        venus.position.set(0, 0, zInit);
        zInit -= 5;
        earth.position.set(0, 0, zInit);
        zInit -= 5;
        mars.position.set(0, 0, zInit);
        zInit -= 5;
        jupyter.position.set(0, 0, zInit);
        zInit -= 5;
        jupyter.position.set(0, 0, zInit);
        zInit -= 12;
        saturn.position.set(0, 0, zInit);
        zInit -= 8;
        uranus.position.set(0, 0, zInit);
        zInit -= 5;
        neptune.position.set(0, 0, zInit);

        planets.push(mercury);
        planets.push(venus);
        planets.push(earth);
        planets.push(mars);
        planets.push(jupyter);
        planets.push(saturn);
        planets.push(uranus);
        planets.push(neptune);


        planets.forEach(element => {
            this.scene.add(element);
        });

        return planets;
    }

    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        const render = () => {
            requestAnimationFrame(render);

            this.sun.rotateY(-0.01);

            this.planets.forEach(element => {
                element.rotateY(0.01);
            });

            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.stats.update();
        }
        render();        
    }    

    createCube(wireframe=true) {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: wireframe } );
        
        return new THREE.Mesh(geometry, material);
    }

    createSphere(wireframe=true) {
        const geometry = new THREE.SphereGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: wireframe } );
        
        return new THREE.Mesh(geometry, material);
    }

    createSphereWithTexture(nameTexture, radius = 1) {
        const geometry = new THREE.SphereGeometry(radius);
        const loader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial( { map: loader.load(`resources/images/${nameTexture}.jpg`) } );
        
        return new THREE.Mesh(geometry, material);
    }

    createStars() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for ( let i = 0; i < 10000; i ++ ) {
            vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // x
            vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // y
            vertices.push( THREE.MathUtils.randFloatSpread( 2000 ) ); // z
        }

        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
        
        return particles;
    }

    addLight() {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);

        this.scene.add(light);
    }
}