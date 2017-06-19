import CANNON from 'cannon';
import * as THREE from 'three';

const FPS = 120;
const PHYSICS_DELTA = 1 / FPS;
const GRAVITY = new CANNON.Vec3(0, -9.81, 0);
const MAX_PUSH = 2/8 * Math.PI;

export const AIR_RESISTANCE = 0.1;
export const MATERIALS = {
  static: new CANNON.Material('static'),
  bouncy: new CANNON.Material('bouncy'),
  solid: new CANNON.Material('solid'),
};

class Physics extends CANNON.World {

  constructor() {
    super();
    this.broadphase = new CANNON.SAPBroadphase(this);
    this.gravity.copy(GRAVITY);
    this.solver = new CANNON.GSSolver();

    // Contacts
    this.addContactMaterial(
      new CANNON.ContactMaterial(MATERIALS.bouncy, MATERIALS.static, {
        restitution: 0.7,
      }),
      new CANNON.ContactMaterial(MATERIALS.solid, MATERIALS.static, {})
    );
  }

  update(delta) {
    this.step(PHYSICS_DELTA, delta / 1000);
    this.gravity.set(GRAVITY.x, GRAVITY.y, GRAVITY.z);
  }

  /**
   * Pushes gravity to given direction.
   * @param  {Number} xAxis Push forwards. Give -1 to 1. Positive is forwards.
   * @param  {Number} zAxis Push sidewards. Give -1 to 1. Positive is right.
   */
  controlGravity(xAxis, zAxis) {
    const vector = (new THREE.Vector3()).copy(this.gravity);
    vector.applyAxisAngle(new THREE.Vector3(1, 0, 0), xAxis * MAX_PUSH);
    vector.applyAxisAngle(new THREE.Vector3(0, 0, 1), zAxis * MAX_PUSH);
    this.gravity.copy(vector);
  }

}

export default Physics;
