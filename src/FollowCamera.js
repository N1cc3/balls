import * as THREE from 'three';

class FollowCamera extends THREE.PerspectiveCamera {
    
    constructor(maxSpeed = 1,
                fov = 75, 
                aspect = window.innerWidth / window.innerHeight, 
                near = 0.1, 
                far = 10000) {
        super(fov, aspect, near, far);
        
        this.maxSpeed = maxSpeed;
        this.target = null;
    }
    
    setTarget(target) {
        this.target = target;
        let targetPos = target.position;
        this.position.set(targetPos.x, targetPos.y + 5, targetPos.z + 10);
    }
    
    update() {
        let targetPos = this.target.position;
        let posVec = new THREE.Vector3(targetPos.x - this.position.x, targetPos.y + 5 - this.position.y, targetPos.z + 10 - this.position.z);
        posVec.clampLength(0, this.maxSpeed);
        this.position.add(posVec);
        this.lookAt(targetPos);
    }
}

export default FollowCamera;