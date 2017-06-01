import * as THREE from 'three';
import CANNON from 'cannon';

class GameObject extends CANNON.Body {

  constructor(options) {
    super(options);
    this.mesh = null;
  }

  setVisual(scene, mesh) {
    this.mesh = mesh;
    scene.add(mesh);
  }

  update() {
    // Update mesh according to body
    let pos = this.position;
    this.mesh.position.set(pos.x, pos.y, pos.z);
    let quat = this.quaternion;
    this.mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
  }

}

export default GameObject;
