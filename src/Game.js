import * as THREE from 'three';
import Physics from './Physics';

export const SCENE = new THREE.Scene();
export const PHYSICS = new Physics();

class Game {

  constructor() {
    this.objects = [];
  }

  update(delta) {
    PHYSICS.update(delta);
    for (const object of this.objects)
      object.update();
  }

  addObject(object) {
    PHYSICS.add(object);
    this.objects.push(object);
  }

  loadLevel(level) {
    for (const object of level.objects)
      this.addObject(object);

    SCENE.add(level.background);
  }

}

export default Game;
