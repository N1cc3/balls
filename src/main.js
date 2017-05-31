import * as THREE from '../node_modules/three/build/three.js';
import CANNON from 'cannon';
import Physics from './Physics';
import keymaster from 'keymaster';

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
floor.position.set(0, -2.5, 0);
scene.add(floor);

let floorPhysicalShape = new CANNON.Plane();
let floorPhysicalMaterial = new CANNON.Material('floor');
let floorPhysicalBody = new CANNON.Body({
  shape: floorPhysicalShape,
  material: floorPhysicalMaterial
});
floorPhysicalBody.position.set(0, -2, 0);
floorPhysicalBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

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

let ballFloorContact = new CANNON.ContactMaterial(ballPhysicalMaterial, floorPhysicalMaterial);
ballFloorContact.contactEquationStiffness = 1e4;
ballFloorContact.contactEquationRegularizationTime = 1;
ballFloorContact.restitution = 1;
physics.addContactMaterial(ballFloorContact);

// PLAYER CONTROLS
let up = keymaster.isPressed('w');
let down = keymaster.isPressed('s');
let left = keymaster.isPressed('a');
let right = keymaster.isPressed('d');

// GAME LOOP
let previousTime;
function render() {
  let time = new Date().getTime();
  let delta = time - previousTime;
  previousTime = time;

  physics.update(delta);

  // UPDATE BALL POSITION
  let ballPosition = ballPhysicalBody.position;
  ball.position.set(ballPosition.x, ballPosition.y, ballPosition.z);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
