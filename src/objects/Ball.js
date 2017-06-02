import * as THREE from 'three';
import CANNON from 'cannon';
import Object from '../Object';
import {AIR_RESISTANCE, MATERIALS} from '../Physics';
import {SCENE} from '../Game'

class Ball extends Object {

  constructor(r, segments, color) {
    let geometry = new THREE.SphereGeometry(r, segments, segments);
    let material = new THREE.MeshStandardMaterial({color: color});
    let mesh = new THREE.Mesh(geometry, material);

    let shape = new CANNON.Sphere(r);

    super({
      mass: 1,
      shape: shape,
      material: MATERIALS.bouncy,
      linearDamping: AIR_RESISTANCE
    });

    this.setVisual(SCENE, mesh);
  }

}

export default Ball;
