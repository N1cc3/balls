import * as THREE from 'three';
import CANNON from 'cannon';
import keymaster from 'keymaster';
import Box from './objects/Box';
import Game from './Game';
import {SCENE, PHYSICS} from './Game';

// SCENE, CAMERA, RENDERER
let game = new Game();
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
let ambientLight = new THREE.AmbientLight(0x444444, 0.5);
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 50, 25);
light.castShadow = true;
SCENE.add(ambientLight);
SCENE.add(light);

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


SCENE.add(floorBottom);
SCENE.add(floorLeft);
SCENE.add(floorRight);

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
let box = new Box(1, 1, 1, '#ffff00');
box.position.set(7, 5, 0);

// PHYSICS
game.addObject(box);
PHYSICS.add(floorBottomPhysicalBody);
PHYSICS.add(floorLeftPhysicalBody);
PHYSICS.add(floorRightPhysicalBody);

for (let i = 0; i < 10; i++) {
  let box = new Box(1, 1, 1, '#ffff00');
  box.position.set(-5 + i, 5, 0);
  game.addObject(box);
}

// GAME LOOP
let previousTime;
function render() {
  let time = new Date().getTime();
  let delta = time - previousTime;
  previousTime = time;

  // PLAYER CONTROLS
  let up = keymaster.isPressed('w');
  let down = keymaster.isPressed('s');
  let left = keymaster.isPressed('a');
  let right = keymaster.isPressed('d');

  let forceDirection = new CANNON.Vec3(0, 0, 0);
  if (up) {
    forceDirection.vadd(new CANNON.Vec3(0, 0, -1), forceDirection);
  }
  if (down) {
    forceDirection.vadd(new CANNON.Vec3(0, 0, 1), forceDirection);
  }
  if (left) {
    forceDirection.vadd(new CANNON.Vec3(-1, 0, 0), forceDirection);
  }
  if (right) {
    forceDirection.vadd(new CANNON.Vec3(1, 0, 0), forceDirection);
  }
  let forcePoint = forceDirection.clone().negate();
  let pos = box.position;
  forcePoint.vadd(new CANNON.Vec3(pos.x, pos.y, pos.z));
  box.applyImpulse(forceDirection, forcePoint);

  game.update(delta);

  renderer.render(SCENE, camera);
  requestAnimationFrame(render);
}
render();
