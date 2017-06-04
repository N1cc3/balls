import * as THREE from 'three';

class FollowCamera extends THREE.PerspectiveCamera {
    
  constructor(baseRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI/6),
              maxRotDeviation = 30*(Math.PI/180),
              followVel = 0.000005,
              angVel = 0.002,
              baseDistance = 10,
              fov = 75, 
              aspect = window.innerWidth / window.innerHeight, 
              near = 0.1, 
              far = 10000) {
    super(fov, aspect, near, far);

    this.targetBack = new THREE.Vector3(0, 0, 1);
    this.targetBackRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 0), 0);
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
    let targetPos = this.target.position;
    let posVec = this.targetBack.clone().applyQuaternion(this.baseRotation).setLength(this.baseDistance);
    this.position.set(targetPos.x + posVec.x, targetPos.y + posVec.y, targetPos.z + posVec.z);
    this.lookAt(targetPos);
  }
  
  calcPosVec(delta, heading) {
    let goalQuat;
    
    if (heading.length() != 0) {
      let axisAngleHeading = heading.set(heading.y, heading.x, 0);
      let maxRotDevQuat = new THREE.Quaternion().setFromAxisAngle(heading, this.maxRotDeviation);
      goalQuat = this.baseRotation.clone().multiply(maxRotDevQuat);
    } else {
      goalQuat = this.baseRotation.clone();
    }
    
    let rotDiff = this.quaternionAngleDiff(this.currRotation, goalQuat);
    let tRot = Math.min(1, delta*(this.angVel/rotDiff));
    this.currRotation.slerp(goalQuat, tRot);
    
    let targetVel = this.target.velocity.clone();
    if (targetVel.x < 5) targetVel.x = 0;
    if (targetVel.y < 20) targetVel.y = 0;
    if (targetVel.z < 5) targetVel.z = 0;
    if (targetVel.length() > 4) {
      targetVel = targetVel.negate();
      targetVel.normalize();
      let goalQuatBack = new THREE.Quaternion().setFromUnitVectors(this.targetBack, targetVel);
      console.log(targetVel);
      console.log(goalQuatBack);
      
      let followDiff = this.quaternionAngleDiff(this.targetBackRot, goalQuatBack);
      let tFollow = Math.min(1, delta*(this.followVel/followDiff));
      this.targetBackRot.slerp(goalQuatBack, tFollow);
      console.log(this.targetBackRot);
      this.targetBack.applyQuaternion(this.targetBackRot);
    }

    return this.targetBack.clone().applyQuaternion(this.currRotation).setLength(this.baseDistance);   
  }
  
  quaternionAngleDiff(q1, q2) {
    return Math.acos(q1.dot(q2))/(q1.length()*q2.length());
  }
  
  update(delta, heading) {
    let targetPos = this.target.position;
    let posVec = this.calcPosVec(delta, heading);

    this.position.set(targetPos.x + posVec.x, targetPos.y + posVec.y, targetPos.z + posVec.z);
    this.lookAt(targetPos);
  }
}

export default FollowCamera;
