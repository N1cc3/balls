import * as THREE from 'three';
import CANNON from 'cannon';
import Object from '../Object';
import {AIR_RESISTANCE, MATERIALS} from '../Physics';
import {SCENE} from '../Game'

class Box extends Object {

  constructor(x, y, z, color) {
    let boxGeometry = new THREE.BoxGeometry(x, y, z);
    let boxMaterial = new THREE.MeshStandardMaterial({color: color});
    let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    let boxPhysicalShape = new CANNON.Box(
      new CANNON.Vec3(x/2, y/2, z/2)
    );

    super({
      mass: 1,
      shape: boxPhysicalShape,
      material: MATERIALS.bouncy,
      linearDamping: 0.1
    });

    this.setVisual(SCENE, boxMesh);
  }

}

export default Box;
