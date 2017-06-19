import * as THREE from 'three';
import {Utils,} from './Utils';

const POSITION_VELOCITY = 0.1;
const ROTATION_VELOCITY = 0.2; // This should be larger than POSITION_VELOCITY.

class StaticRotationFollowCamera extends THREE.PerspectiveCamera {

  constructor(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.1, far = 50) {
    super(fov, aspect, near, far);
    this.offset = new THREE.Vector3(0, 1, 1);
    this.oldTargetPosition = new THREE.Vector3();
  }

  /**
   * Moves camera target towards targetPosition and rotates camera to keep base rotation.
   * @param  {THREE.Vector3} _targetPosition Any object with x, y, and z values work.
   */
  update(_targetPosition) {
    const targetPosition = Utils.toThreeVec(_targetPosition);
    const targetCameraPosition = targetPosition.clone();
    targetCameraPosition.add(this.offset);
    this.position.lerp(targetCameraPosition, POSITION_VELOCITY);
    const lerpedTargetPosition = this.oldTargetPosition.clone();
    lerpedTargetPosition.lerp(targetPosition, ROTATION_VELOCITY);
    this.lookAt(lerpedTargetPosition);
    this.oldTargetPosition.copy(lerpedTargetPosition);
  }

}

export default StaticRotationFollowCamera;
