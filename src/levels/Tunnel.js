import * as THREE from 'three';
import CANNON from 'cannon';
import Level from '../Level';
import Pipe from '../objects/Pipe';
import Box from '../objects/Box';
import {MATERIALS,} from '../Physics';

class Tunnel extends Level {

  constructor() {
    super();

    const background = new THREE.Mesh(
      new THREE.SphereGeometry(40, 32, 32),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('./media/backgrounds/parco_della_caffarella.jpeg'),
      })
    );
    background.scale.x = -1; // Invert the sphere
    this.setBackground(background);

    const finish = new Box(1, 0.5, 0.5, '#0000ff');
    finish.mass = 0;
    finish.updateMassProperties();
    finish.material = MATERIALS.static;
    finish.mesh.material.transparent = true;
    finish.mesh.material.opacity = 0.5;
    finish.mesh.castShadow = false;
    finish.mesh.receiveShadow = false;

    finish.position.set(0, -0.2, -3);

    this.setFinish(finish);

    const pipe1 = new Pipe(0.5, 6, 0.05, 8, 0.5, -Math.PI / 2);
    pipe1.mass = 0;
    pipe1.updateMassProperties();
    pipe1.material = MATERIALS.static;
    // pipe1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 0);
    // pipe1.position.set(0, 0, 0);
    this.add(pipe1);

    const pipe2 = new Pipe(0.5, 6, 0.05, 8, 0.5, -Math.PI / 2);
    pipe2.mass = 0;
    pipe2.updateMassProperties();
    pipe2.material = MATERIALS.static;
    pipe2.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -1/8 * 2 * Math.PI);
    pipe2.position.set(0, -2.4, -5.5);
    this.add(pipe2);

    const pipe3 = new Pipe(0.5, 6, 0.05, 8, 0.5, -Math.PI / 2);
    pipe3.mass = 0;
    pipe3.updateMassProperties();
    pipe3.material = MATERIALS.static;
    // pipe3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), 0);
    pipe3.position.set(0, -5.1, -11);
    this.add(pipe3);

    const pipe4 = new Pipe(0.5, 1, 0.05, 8, 0.5, 0.5 * -Math.PI / 2);
    pipe4.mass = 0;
    pipe4.updateMassProperties();
    pipe4.material = MATERIALS.static;
    pipe4.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 1/8 * 2 * Math.PI);
    pipe4.position.set(-0.2, -5.1, -14.3);
    this.add(pipe4);

    const pipe5 = new Pipe(0.5, 1, 0.05, 8, 0.5, 0.5 * -Math.PI / 2);
    pipe5.mass = 0;
    pipe5.updateMassProperties();
    pipe5.material = MATERIALS.static;
    pipe5.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 2/8 * 2 * Math.PI);
    pipe5.position.set(-0.8, -5.1, -14.5);
    this.add(pipe5);

    const pipe6 = new Pipe(0.5, 1, 0.05, 8, 0.5, 0.5 * -Math.PI / 2);
    pipe6.mass = 0;
    pipe6.updateMassProperties();
    pipe6.material = MATERIALS.static;
    pipe6.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 3/8 * 2 * Math.PI);
    pipe6.position.set(-1.3, -5.1, -14.3);
    this.add(pipe6);
  }

}

export default Tunnel;
