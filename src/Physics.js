import CANNON from 'cannon';

const PHYSICS_DELTA = 1 / 60;
const SUBSTEPS = 1;

class Physics extends CANNON.World {

  constructor() {
    super();
    this.broadphase = new CANNON.SAPBroadphase(this);
    this.gravity = new CANNON.Vec3(0, -9.81, 0);
    this.allowSleep = false;
    this.solver = new CANNON.GSSolver();
    this.solver.iterations = 10;
    this.solver.tolerance = 0.001;
  }

  update(delta) {
    this.step(PHYSICS_DELTA, delta, SUBSTEPS);
  }

}

export default Physics;
