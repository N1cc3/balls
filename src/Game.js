import * as THREE from 'three';
import Physics from './Physics';

export const SCENE = new THREE.Scene();
export const PHYSICS = new Physics();

class Game {

  constructor() {
    this.objects = [];
    this.player = null;
  }

  update(delta) {
    PHYSICS.update(delta);
    this.player.update();
    for (const object of this.objects) {
      object.update();
    }
  }

  setPlayer(player) {
    this.player = player;
    for (const ball of player.balls) {
      this.addObject(ball);
    }
  }

  addObject(object) {
    PHYSICS.add(object);
    this.objects.push(object);
  }

  loadLevel(level) {
    for (const object of level.objects) {
      this.addObject(object);
    }

    SCENE.add(level.background);
  }

}

export default Game;
