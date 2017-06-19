import * as THREE from 'three';
// import CANNON from 'cannon';
import keymaster from 'keymaster';
import XboxController from './controllers/xbox';
import FollowCamera from './FollowCamera';
import Box from './objects/Box';
// import Ball from './objects/Ball';
import Player from './Player';
import Game from './Game';
import {SCENE, PHYSICS,} from './Game';
import Tunnel from './levels/Tunnel';

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
controller.onButton('axis_left', (event) => {
  console.log(event.value);
});

// LIGHTS
const ambientLight = new THREE.AmbientLight(0x444444, 0.5);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(25, 50, 25);
light.castShadow = true;
SCENE.add(ambientLight);
SCENE.add(light);

light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
light.shadow.camera.near = 1;
light.shadow.camera.far = 100;
light.shadow.camera.left = -20;
light.shadow.camera.right = 20;
light.shadow.camera.down = -20;
light.shadow.camera.top = 20;

// GAME OBJECTS
// const ball = new Ball(0.05, 32, '#ff0000');
// ball.position.set(0, 0.1, 0.2);

const player = new Player(15, 0.05, 32, '#ff0000');

followCamera.setTarget(player);

// PHYSICS
// game.addObject(ball);
game.setPlayer(player);

const boxSpawnAmount = 10;
for (let i = 0; i < boxSpawnAmount; i++) {
  const box = new Box(0.1, 0.1, 0.1, '#ffff00');
  box.position.set(0, 0.2, -0.2 * i);
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

game.loadLevel(new Tunnel());

// GAME LOOP
let previousTime;
function render() {
  const time = new Date().getTime();
  const delta = time - previousTime;
  previousTime = time;

  // PLAYER CONTROLS
  controller.handleInput();
  const up = keymaster.isPressed('w');
  const down = keymaster.isPressed('s');
  const left = keymaster.isPressed('a');
  const right = keymaster.isPressed('d');

  if (up) PHYSICS.controlGravity(1, 0);
  if (down) PHYSICS.controlGravity(-1, 0);
  if (left) PHYSICS.controlGravity(0, -1);
  if (right) PHYSICS.controlGravity(0, 1);

  game.update(delta);

  // const heading = new THREE.Vector3(forceDirection.x, forceDirection.z, 0);
  // if (heading.length() !== 0) heading.normalize();

  followCamera.update(delta, new THREE.Vector3());

  renderer.render(SCENE, followCamera);

  requestAnimationFrame(render);
}
render();
