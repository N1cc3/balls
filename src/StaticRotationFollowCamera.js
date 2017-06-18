import * as THREE from 'three';

class StaticRotationFollowCamera extends THREE.PerspectiveCamera {

  constructor(fov = 75, aspect = window.innerWidth / window.innerHeight, near = 0.001, far = 100) {
    super(fov, aspect, near, far);
    this.baseRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 1/8 * Math.PI);
    this.followVel = 0.01;
    this.angVel = 0.01;
    this.baseDistance = 1;
  }

}

export default StaticRotationFollowCamera;
