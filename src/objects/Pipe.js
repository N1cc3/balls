import * as THREE from 'three';
import CANNON from 'cannon';
import Object from '../Object';
import {AIR_RESISTANCE, MATERIALS,} from '../Physics';
import {SCENE,} from '../Game';

class Pipe extends Object {

  /**
   * Best used for pipes or halfpipes.
   * @param  {Number} radius
   * @param  {Number} length
   * @param  {Number} [thickness=0.1]   How thick the walls are.
   * @param  {Number} [resolution=32]   How smooth the pipe is.
   * @param  {Number} [sector=1]        1 = pipe, 0.5 = halfpipe
   * @param  {Number} [startAngle=0]    0 = straight down
   * @param  {String} [color='#00ff00'] hashtag + hexadecimal
   * @return {Pipe}                     extends Object.
   */
  constructor(radius,
              length,
              thickness = 0.2,
              resolution = 16,
              sector = 1,
              startAngle = 0,
              color = '#00ff00') {
    super({
      mass: 1,
      material: MATERIALS.solid,
      linearDamping: AIR_RESISTANCE,
    });

    const sectorAngle = 2 * Math.PI * sector / resolution;
    const width = 2 * radius * Math.sin(sectorAngle / 2);
    const sagitta = radius - Math.sqrt(radius * radius - (width / 2) * (width / 2));

    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({color: color,});

    for (let i = 0; i < resolution; i++) {
      const direction = sectorAngle / 2 + startAngle + i * sectorAngle;
      const offset = new THREE.Vector3(radius * Math.sin(direction), -radius * Math.cos(direction), 0);
      const directionVector = (new THREE.Vector3(0, -1, 0)).applyAxisAngle(new THREE.Vector3(0, 0, 1), direction);
      offset.sub(directionVector.setLength(sagitta));

      // Visual
      const geometry = new THREE.BoxGeometry(width, thickness, length);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(offset);
      mesh.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), direction);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Physical
      const shape = new CANNON.Box(
        (new CANNON.Vec3(width, thickness, length)).scale(0.5)
      );
      const quaternion = new CANNON.Quaternion(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
      this.addShape(shape, offset, quaternion);
    }

    this.setVisual(SCENE, group);
  }

}

export default Pipe;
