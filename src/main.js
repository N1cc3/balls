import * as THREE from 'three';
import CANNON from 'cannon';
import keymaster from 'keymaster';
import FollowCamera from './FollowCamera';
import Box from './objects/Box';
import Ball from './objects/Ball';
import Game from './Game';
import {SCENE, PHYSICS} from './Game';
import HalfPipe from './levels/HalfPipe';
import {MATERIALS} from './Physics';

// SCENE, CAMERA, RENDERER
let game = new Game();
let aspect = window.innerWidth / window.innerHeight;
let followCamera = new FollowCamera();
followCamera.position.z = 20;

let audioLoader = new THREE.AudioLoader();
let listener = new THREE.AudioListener();
followCamera.add(listener);

let renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.setAttribute('tabIndex', '0');
renderer.domElement.focus();

window.onresize = function () {
  aspect = window.innerWidth / window.innerHeight
  followCamera.aspect = aspect;
  followCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// LIGHTS
let ambientLight = new THREE.AmbientLight(0x444444, 0.5);
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(25, 50, 25);
light.castShadow = true;
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.bottom = -20;
SCENE.add(ambientLight);
SCENE.add(light);

// GAME OBJECTS
let ball = new Ball(1, 32, '#ff0000');
ball.position.set(0, 5, 10);

followCamera.setTarget(ball);

// PHYSICS
game.addObject(ball);

for (let i = 0; i < 10; i++) {
  let box = new Box(1, 1, 1, '#ffff00');
  box.position.set(-5 + i, 5, 0);
  game.addObject(box);
}

// SOUNDS
audioLoader.load('../sounds/thump.mp3', function(buffer) {
  for (let object of game.objects) {
    object.onCollide((e) => {
      let contact = e.contact;
      let hitSpeed = Math.abs(contact.getImpactVelocityAlongNormal());
      let volume = 0.2 * hitSpeed;
      if (volume > 0.1) {
        let sound = new THREE.PositionalAudio(listener);
        sound.setBuffer(buffer);
        sound.setRefDistance(volume);
        object.mesh.add(sound);
        sound.play();
      }
    });
  }
});

game.loadLevel(new HalfPipe());

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

  game.update(delta, ball);

  let heading = new THREE.Vector3(forceDirection.x, forceDirection.z, 0);
  if (heading.length() !== 0) {
    heading.normalize();
  }
  followCamera.update(delta, heading);

  renderer.render(SCENE, followCamera);
  requestAnimationFrame(render);
}
render();
