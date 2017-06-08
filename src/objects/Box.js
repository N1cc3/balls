import * as THREE from 'three';
import CANNON from 'cannon';
import Object from '../Object';
import {AIR_RESISTANCE, MATERIALS,} from '../Physics';
import {SCENE,} from '../Game';

class Box extends Object {

  constructor(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshStandardMaterial({color: color,});
    const mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const shape = new CANNON.Box(
      (new CANNON.Vec3(x, y, z)).scale(0.5)
    );

    super({
      mass: 1,
      shape: shape,
      material: MATERIALS.bouncy,
      linearDamping: AIR_RESISTANCE,
    });

    this.setVisual(SCENE, mesh);
  }

}

export default Box;
