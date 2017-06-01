import * as THREE from 'three';
import CANNON from 'cannon';
import Physics from './Physics';

export const SCENE = new THREE.Scene();
export const PHYSICS = new Physics();

class Game {

  constructor() {
    this.objects = [];
  }

  update(delta) {
    PHYSICS.update(delta);
    for (let object of this.objects) {
      object.update();
    }
  }

  addObject(object) {
    PHYSICS.add(object);
    this.objects.push(object);
  }

}

export default Game;
