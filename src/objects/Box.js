import * as THREE from 'three';
import CANNON from 'cannon';
import Object from '../Object';
import {AIR_RESISTANCE, MATERIALS} from '../Physics';
import {SCENE} from '../Game'

class Box extends Object {

  constructor(x, y, z, color) {
    let geometry = new THREE.BoxGeometry(x, y, z);
    let material = new THREE.MeshStandardMaterial({color: color});
    let mesh = new THREE.Mesh(geometry, material);

    let shape = new CANNON.Box(
      new CANNON.Vec3(x/2, y/2, z/2)
    );

    super({
      mass: 1,
      shape: shape,
      material: MATERIALS.bouncy,
      linearDamping: AIR_RESISTANCE
    });

    this.setVisual(SCENE, mesh);
  }

}

export default Box;
