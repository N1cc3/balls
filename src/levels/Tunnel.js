import * as THREE from 'three';
// import CANNON from 'cannon';
import Level from '../Level';
import Pipe from '../objects/Pipe';
import {MATERIALS,} from '../Physics';

class Tunnel extends Level {

  constructor() {
    super();

    const background = new THREE.Mesh(
      new THREE.SphereGeometry(2000, 32, 32),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./media/backgrounds/parco_della_caffarella.jpeg'),
      })
    );
    background.scale.x = -1; // Invert the sphere
    this.setBackground(background);

    const pipe1 = new Pipe(10, 3000, 0.2, 32, 0.5, -Math.PI / 2);
    pipe1.mass = 0;
    pipe1.updateMassProperties();
    pipe1.material = MATERIALS.static;
    // pipe1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 0);
    // pipe1.position.set(0, 0, 0);
    this.add(pipe1);
  }

}

export default Tunnel;
