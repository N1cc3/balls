import * as THREE from '../node_modules/three/build/three.js';
import CANNON from 'cannon';
import Physics from './Physics';

// SCENE, CAMERA, RENDERER
let scene = new THREE.Scene();
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
camera.position.z = 20;
let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.setAttribute('tabIndex', '0');
renderer.domElement.focus();

// LIGHTS
let ambientLight = new THREE.AmbientLight(0x444444, 0.1);
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 50, 0);
light.castShadow = true;
scene.add(ambientLight);
scene.add(light);

// FLOOR
let floorBottomGeometry = new THREE.BoxGeometry(10, 0.1, 30);
let floorLeftGeometry = new THREE.BoxGeometry(10, 0.1, 30);
let floorRightGeometry = new THREE.BoxGeometry(10, 0.1, 30);

let floorMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
floorMaterial.side = THREE.DoubleSide;

let floorBottom = new THREE.Mesh(floorBottomGeometry, floorMaterial);
floorBottom.castShadow = true;
floorBottom.receiveShadow = true;
floorBottom.position.set(0, -2.5, 0);
floorBottom.rotation.set(0, 0, 0);

let floorLeft = new THREE.Mesh(floorLeftGeometry, floorMaterial);
floorLeft.castShadow = true;
floorLeft.receiveShadow = true;
floorLeft.position.set(-8, 1.5, 0);
floorLeft.rotation.set(0, 0, 0.7*Math.PI);

let floorRight = new THREE.Mesh(floorRightGeometry, floorMaterial);
floorRight.castShadow = true;
floorRight.receiveShadow = true;
floorRight.position.set(8, 1.5, 0);
floorRight.rotation.set(0, 0, -0.7*Math.PI);


scene.add(floorBottom);
scene.add(floorLeft);
scene.add(floorRight);


let floorPhysicalShape = new CANNON.Plane();
let floorPhysicalMaterial = new CANNON.Material('floor');

let floorBottomPhysicalBody = new CANNON.Body({
  shape: floorPhysicalShape,
  material: floorPhysicalMaterial
});
let floorLeftPhysicalBody = new CANNON.Body({
  shape: floorPhysicalShape,
  material: floorPhysicalMaterial
});
let floorRightPhysicalBody = new CANNON.Body({
  shape: floorPhysicalShape,
  material: floorPhysicalMaterial
});

floorBottomPhysicalBody.position.set(0, -2, 0);
floorBottomPhysicalBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
floorLeftPhysicalBody.position.set(-8, 1.5, 0);
floorLeftPhysicalBody.quaternion.setFromVectors(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(1, 0.85, 0));
floorRightPhysicalBody.position.set(8, 1.5, 0);
floorRightPhysicalBody.quaternion.setFromVectors(new CANNON.Vec3(0, 0, 1), new CANNON.Vec3(-1, 0.85, 0));

// GAME OBJECTS
let ballGeometry = new THREE.SphereGeometry(1, 32, 32);
let ballMaterial = new THREE.MeshStandardMaterial({color: 0xffff00});
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
ballPhysicalBody.position.set(7, 5, 0);

// PHYSICS
let physics = new Physics();
physics.add(ballPhysicalBody);
physics.add(floorBottomPhysicalBody);
physics.add(floorLeftPhysicalBody);
physics.add(floorRightPhysicalBody);

let ballFloorContact = new CANNON.ContactMaterial(ballPhysicalMaterial, floorPhysicalMaterial);
ballFloorContact.contactEquationStiffness = 1e4;
ballFloorContact.contactEquationRegularizationTime = 1;
ballFloorContact.restitution = 1;
physics.addContactMaterial(ballFloorContact);

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
