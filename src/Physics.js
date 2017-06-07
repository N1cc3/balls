import CANNON from 'cannon';

const FPS = 60;
const PHYSICS_DELTA = 1 / FPS;
const SUBSTEPS = 2;
const GRAVITY = -9.81;

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
    this.gravity = new CANNON.Vec3(0, GRAVITY, 0);
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
    this.step(PHYSICS_DELTA, delta, SUBSTEPS);
  }

}

export default Physics;
