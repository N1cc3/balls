import * as THREE from 'three';
import CANNON from 'cannon';

class GameObject extends CANNON.Body {

  constructor() {
    super();
    this.mesh = null;
  }

  setVisual(scene, mesh) {
    this.mesh = mesh;
    scene.add(mesh);
  }

  update() {
  }

}


export default GameObject;
