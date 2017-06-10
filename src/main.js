import * as THREE from 'three';
import CANNON from 'cannon';
import keymaster from 'keymaster';
import XboxController from './controllers/xbox';
import FollowCamera from './FollowCamera';
import Box from './objects/Box';
import Ball from './objects/Ball';
import Game from './Game';
import {SCENE,} from './Game';
import HalfPipe from './levels/HalfPipe';

// SCENE, CAMERA, RENDERER
const game = new Game();
let aspect = window.innerWidth / window.innerHeight;
const followCamera = new FollowCamera();
followCamera.position.z = 20;

const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
followCamera.add(listener);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.domElement.setAttribute('tabIndex', '0');
renderer.domElement.focus();

window.onresize = () => {
  aspect = window.innerWidth / window.innerHeight;
  followCamera.aspect = aspect;
  followCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const controller = new XboxController();

// LIGHTS
const ambientLight = new THREE.AmbientLight(0x444444, 0.5);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(25, 50, 25);
light.castShadow = true;
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.top = 20;
light.shadow.camera.bottom = -20;
SCENE.add(ambientLight);
SCENE.add(light);

// GAME OBJECTS
const ball = new Ball(1, 32, '#ff0000');
ball.position.set(0, 5, 10);

followCamera.setTarget(ball);

// PHYSICS
game.addObject(ball);

const boxSpawnAmount = 10;
for (let i = 0; i < boxSpawnAmount; i++) {
  const box = new Box(1, 1, 1, '#ffff00');
  box.position.set(-5 + i, 5 + 0.2 * i, 0);
  game.addObject(box);
}

// SOUNDS
audioLoader.load('../sounds/thump.mp3', (buffer) => {
  for (const object of game.objects) {
    object.onCollide((e) => {
      const contact = e.contact;
      const hitSpeed = Math.abs(contact.getImpactVelocityAlongNormal());
      const volumeFactor = 0.02;
      const volume = Math.min(1, volumeFactor * hitSpeed);
      if (volume > volumeFactor) {
        const sound = new THREE.PositionalAudio(listener);
        sound.setBuffer(buffer);
        sound.setRefDistance(1);
        sound.setVolume(volume);
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
  const time = new Date().getTime();
  const delta = time - previousTime;
  previousTime = time;

  // PLAYER CONTROLS
  const up = keymaster.isPressed('w');
  const down = keymaster.isPressed('s');
  const left = keymaster.isPressed('a');
  const right = keymaster.isPressed('d');

  const forceDirection = new CANNON.Vec3(0, 0, 0);
  if (up) forceDirection.vadd(new CANNON.Vec3(0, 0, -1), forceDirection);
  if (down) forceDirection.vadd(new CANNON.Vec3(0, 0, 1), forceDirection);
  if (left) forceDirection.vadd(new CANNON.Vec3(-1, 0, 0), forceDirection);
  if (right) forceDirection.vadd(new CANNON.Vec3(1, 0, 0), forceDirection);

  const forcePoint = forceDirection.clone().negate();
  const pos = ball.position;
  forcePoint.vadd(new CANNON.Vec3(pos.x, pos.y, pos.z));
  ball.applyImpulse(forceDirection, forcePoint);

  game.update(delta, ball);

  const heading = new THREE.Vector3(forceDirection.x, forceDirection.z, 0);
  if (heading.length() !== 0) heading.normalize();

  followCamera.update(delta, heading);

  renderer.render(SCENE, followCamera);

  controller.printPressed();
  requestAnimationFrame(render);
}
render();
