import * as THREE from 'three';

class FollowCamera extends THREE.PerspectiveCamera {

  constructor(baseRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI/6),
              maxRotDeviation = 30*(Math.PI/180),
              angVel = 0.002,
              baseDistance = 10,
              fov = 75,
              aspect = window.innerWidth / window.innerHeight,
              near = 0.1,
              far = 10000) {
    super(fov, aspect, near, far);

    this.targetBack = new THREE.Vector3(0, 0, 1);
    this.baseRotation = baseRotation;
    this.currRotation = baseRotation.clone();
    this.maxRotDeviation = maxRotDeviation;
    this.angVel = angVel;
    this.baseDistance = baseDistance;
    this.target = null;
  }

  setTarget(target) {
    this.target = target;
    let targetPos = this.target.position;
    let posVec = this.targetBack.clone().applyQuaternion(this.baseRotation).setLength(this.baseDistance);
    this.position.set(targetPos.x + posVec.x, targetPos.y + posVec.y, targetPos.z + posVec.z);
    this.lookAt(targetPos);
  }

  baseRotationSlerpToPosVec(delta, heading) {
    let goalQuat;

    if (heading.length() != 0) {
      let maxRotDevQuat = new THREE.Quaternion().setFromAxisAngle(heading, this.maxRotDeviation);
      goalQuat = this.baseRotation.clone().multiply(maxRotDevQuat);
    } else {
      goalQuat = this.baseRotation.clone();
    }

    let currGoalDiff = this.quaternionAngleDiff(this.currRotation, goalQuat);
    let t = Math.min(1, delta*(this.angVel/currGoalDiff));

    this.currRotation.slerp(goalQuat, t);
    return this.targetBack.clone().applyQuaternion(this.currRotation).setLength(this.baseDistance);
  }

  quaternionAngleDiff(q1, q2) {
    return Math.acos(q1.dot(q2))/(q1.length()*q2.length());
  }

  update(delta, heading) {
    let targetPos = this.target.position;
    let posVec = this.baseRotationSlerpToPosVec(delta, heading);

    this.position.set(targetPos.x + posVec.x, targetPos.y + posVec.y, targetPos.z + posVec.z);
    this.lookAt(targetPos);
  }
}

export default FollowCamera;
