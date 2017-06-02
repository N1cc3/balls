import CANNON from 'cannon';
import Level from '../Level';
import Box from '../objects/Box';
import {MATERIALS} from '../Physics';

class HalfPipe extends Level {

  constructor() {
    super();

    let bottom = new Box(10, 0.1, 30, '#00ff00');
    let left = new Box(10, 0.1, 30, '#00ff00');
    let right = new Box(10, 0.1, 30, '#00ff00');

    bottom.mass = 0;
    left.mass = 0;
    right.mass = 0;

    bottom.updateMassProperties();
    left.updateMassProperties();
    right.updateMassProperties();

    bottom.material = MATERIALS.static;
    left.material = MATERIALS.static;
    right.material = MATERIALS.static;

    left.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -1);
    right.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 1);

    bottom.position.set(0, -2, 0);
    left.position.set(-8, 1.5, 0);
    right.position.set(8, 1.5, 0);


    this.add(bottom);
    this.add(left);
    this.add(right);
  }

}

export default HalfPipe;
