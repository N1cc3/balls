import * as THREE from '../node_modules/three/build/three.js';
import Physics from './Physics';

// SCENE, CAMERA, RENDERER
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
camera.position.z = 5;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.setAttribute('tabIndex', '0');
renderer.domElement.focus();

// LIGHTS
let ambientLight = new THREE.AmbientLight(0x444444, 0.1);
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1000, 0);
scene.add(ambientLight);
scene.add(light);

// FLOOR
let floorGeometry = new THREE.BoxGeometry(5, 1, 5);
let floorMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.set(0, -2, 0);
scene.add(floor);

let floorPhysicalShape = new CANNON.Plane();
let floorPhysicalMaterial = new CANNON.Material('floor');
let floorPhysicalBody = new CANNON.Body({
  shape: floorPhysicalShape,
  material: floorPhysicalMaterial
});

// GAME OBJECTS
let ballGeometry = new THREE.SphereGeometry(1, 32, 32);
let ballMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
let ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

let ballPhysicalShape = new CANNON.Sphere(1);
let ballPhysicalMaterial = new CANNON.Material('ball');
let ballPhysicalBody = new CANNON.Body({
  mass: 1,
  shape: ballPhysicalShape,
  material: ballPhysicalMaterial,
  linearDamping: 0.1
});

// PHYSICS
let physics = new Physics();
physics.add(ballPhysicalBody);
physics.add(floorPhysicalBody);

// GAME LOOP
let previousTime;
function render() {
  let time = new Date().getTime();
  let delta = time - previousTime;
  previousTime = time;

  renderer.render(scene, camera);
  physics.update(delta);
  requestAnimationFrame(render);
}
render();
