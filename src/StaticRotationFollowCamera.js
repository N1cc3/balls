import * as THREE from 'three';
import {Utils,} from './Utils';

class StaticRotationFollowCamera extends THREE.PerspectiveCamera {

  constructor(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.001, far = 100) {
    super(fov, aspect, near, far);
    this.baseOffset = new THREE.Vector3(0, 1, 1);
    this.offset = this.baseOffset;
  }

  /**
   * Moves camera target towards targetPosition and rotates camera to keep base rotation.
   * @param {THREE.Vector3} _targetPosition Any object with x, y, and z values work.
   */
  update(_targetPosition) {
    const targetPosition = Utils.toThreeVec(_targetPosition);
    const targetCameraPosition = targetPosition.clone();
    targetCameraPosition.add(this.offset);
    this.position.copy(targetCameraPosition);

    this.lookAt(targetPosition);
  }

  /**
   * @param {THREE.Vector3} offset
   */
  setOffset(offset) {
    this.offset = offset;
  }

}

export default StaticRotationFollowCamera;
