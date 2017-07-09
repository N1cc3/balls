import * as THREE from 'three';
import Physics from './Physics';
import {Utils,} from './Utils';

export const SCENE = new THREE.Scene();
export const PHYSICS = new Physics();

class Game {

  constructor() {
    this.objects = [];
    this.player = null;
    this.level = null;
  }

  update(delta) {
    PHYSICS.update(delta);
    this.player.update();
    for (const object of this.objects) {
      // Level deadzone check
      if (object.position.length() > this.level.deadzoneDistance) {
        object.markToBeRemoved();
      }

      if (object.isToBeRemoved) {
        PHYSICS.removeBody(object);
        SCENE.remove(object.mesh);
        Utils.removeElementFromArray(object, this.objects);
        this.player.removeBall(object);
      } else {
        object.update();
      }
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
    this.level = level;

    for (const object of level.objects) {
      this.addObject(object);
    }

    this.addObject(level.finish);

    for (const ball of this.player.balls) {
      level.addFinishableObject(ball, (object) => {
        object.markToBeRemoved();
        this.player.addPoints(1);
        console.log(`Points: ${this.player.points}`);
      });
    }

    SCENE.add(level.background);
  }

}

export default Game;
