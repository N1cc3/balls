import * as THREE from 'three';

class FollowCamera extends THREE.PerspectiveCamera {
    
  constructor(baseRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI/24),
              maxRotDeviation = 30*(Math.PI/180),
              followVel = 0.02,
              angVel = 0.002,
              baseDistance = 10,
              fov = 75, 
              aspect = window.innerWidth / window.innerHeight, 
              near = 0.1, 
              far = 10000) {
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
    let targetPos = this.target.position;
    this.truePos = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z + this.baseDistance);
    let posVec = this.getRelativePos().setLength(this.baseDistance).applyQuaternion(this.baseRotation);
    this.position.set(targetPos.x + posVec.x, targetPos.y + posVec.y, targetPos.z + posVec.z);
    this.lookAt(targetPos);
  }
  
  update(delta, heading) {
    let targetPos = this.target.position;
    let posVec = this.calcPosVec(delta, heading);

    this.position.set(targetPos.x + posVec.x, targetPos.y + posVec.y, targetPos.z + posVec.z);
    this.lookAt(targetPos);
  }
  
  calcPosVec(delta, heading) {
    
    let rotation = this.calcRotation(delta, heading);
    let posVec = this.calcBackVec(delta);

    return posVec.applyQuaternion(rotation);   
  }
  
  calcRotation(delta, heading) {
    let goalQuat;
    if (heading.length() != 0) {
      let axisAngleHeading = heading.set(heading.y, heading.x, 0);
      let maxRotDevQuat = new THREE.Quaternion().setFromAxisAngle(heading, this.maxRotDeviation);
      goalQuat = this.baseRotation.clone().multiply(maxRotDevQuat);
    } else {
      goalQuat = this.baseRotation.clone();
    }
    
    let rotDiff = this.quaternionAngleDiff(this.currRotation, goalQuat);
    let t = Math.min(1, delta*(this.angVel/rotDiff));
    return this.currRotation.slerp(goalQuat, t).clone();
  }
  
  quaternionAngleDiff(q1, q2) {
    return Math.acos(q1.dot(q2))/(q1.length()*q2.length());
  }
  
  calcBackVec(delta) {
    let thispos = this.truePos.clone();
    let targetPos = this.target.position.clone();
    let posDiff = new THREE.Vector3(targetPos.x - thispos.x, targetPos.y - thispos.y, targetPos.z - thispos.z);
    
    /*
    if (Math.abs(Math.atan(posDiff.y/posDiff.x)) < Math.PI/4) {
        thispos.y = 0;
    }
    */
    
    if (posDiff.length() > this.baseDistance && !isNaN(delta)) {
        posDiff.multiplyScalar(1 - this.baseDistance/posDiff.length());
        this.truePos.lerp(thispos.add(posDiff), delta*this.followVel);
    }

    return this.getRelativePos();
  }
  
  getRelativePos() {
    let thisPos = this.truePos;
    let targetPos = this.target.position;
    return new THREE.Vector3(thisPos.x - targetPos.x, thisPos.y - targetPos.y, thisPos.z - targetPos.z);
  }
  
}

export default FollowCamera;
