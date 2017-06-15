import * as THREE from 'three';

class FollowCamera extends THREE.PerspectiveCamera {

  constructor(baseRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI/24),
              maxRotDeviation = 30*(Math.PI/180),
              followVel = 0.01,
              angVel = 0.002,
              baseDistance = 1,
              fov = 75,
              aspect = window.innerWidth / window.innerHeight,
              near = 0.001,
              far = 100) {
    super(fov, aspect, near, far);

    this.truePos = null;
    this.baseRotation = baseRotation;
    this.currRotation = baseRotation.clone();
    this.maxRotDeviation = maxRotDeviation;
    this.followVel = followVel;
    this.angVel = angVel;
    this.baseDistance = baseDistance;
    this.target = null;
  }

  setTarget(target) {
    this.target = target;
    const targetPos = this.target.position;
    this.truePos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z + this.baseDistance);
    const posVec = this.truePos.clone()
      .sub(targetPos)
      .setLength(this.baseDistance)
      .applyQuaternion(this.baseRotation);
    this.position.copy(targetPos.clone().vadd(posVec));
    this.lookAt(targetPos);
  }

  update(delta, heading) {
    const targetPos = this.target.position;
    const posVec = this.calcPosVec(delta, heading);

    this.position.copy(targetPos.clone().vadd(posVec));
    this.lookAt(targetPos);
  }

  calcPosVec(delta, heading) {
    const rotation = this.calcRotation(delta, heading);
    const posVec = this.calcBackVec(delta);

    return posVec.applyQuaternion(rotation);
  }

  calcRotation(delta, heading) {
    let goalQuat;
    if (heading.length() !== 0) {
      heading.set(heading.y, -heading.x, 0);
      const maxRotDevQuat = new THREE.Quaternion().setFromAxisAngle(heading, this.maxRotDeviation);
      goalQuat = this.baseRotation.clone().multiply(maxRotDevQuat);
    } else {
      goalQuat = this.baseRotation.clone();
    }

    const rotDiff = quaternionAngleDiff(this.currRotation, goalQuat);
    const t = Math.min(1, delta*(this.angVel/rotDiff));
    return this.currRotation.slerp(goalQuat, t).clone();
  }

  calcBackVec(delta) {
    const thisPos = this.truePos.clone();
    const targetPos = this.target.position.clone();
    const posDiff = targetPos.vsub(thisPos);

    /*
    if (Math.abs(Math.atan(posDiff.y/posDiff.x)) < Math.PI/4) {
      thispos.y = 0;
    }
    */

    if (posDiff.length() > this.baseDistance && !isNaN(delta)) {
      this.truePos.lerp(thisPos.add(posDiff), delta*this.followVel*(1 - this.baseDistance/posDiff.length()));
    }


    return this.truePos.clone().sub(targetPos);
  }
}

function quaternionAngleDiff(q1, q2) {
  return Math.acos(q1.dot(q2))/(q1.length()*q2.length());
}

export default FollowCamera;
