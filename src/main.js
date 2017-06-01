import * as THREE from 'three';
import CANNON from 'cannon';
import keymaster from 'keymaster';
import Box from './objects/Box';
import Ball from './objects/Ball';
import Game from './Game';
import {SCENE, PHYSICS} from './Game';
import HalfPipe from './levels/HalfPipe';

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
light.position.set(25, 50, 25);
light.castShadow = true;
SCENE.add(ambientLight);
SCENE.add(light);

// GAME OBJECTS
let ball = new Ball(1, 32, '#ff0000');
ball.position.set(7, 5, 0);

// PHYSICS
game.addObject(ball);
game.loadLevel(new HalfPipe());

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
  let pos = ball.position;
  forcePoint.vadd(new CANNON.Vec3(pos.x, pos.y, pos.z));
  ball.applyImpulse(forceDirection, forcePoint);

  game.update(delta);

  renderer.render(SCENE, camera);
  requestAnimationFrame(render);
}
render();
