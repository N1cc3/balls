import * as THREE from 'three';
import CANNON from 'cannon';

export const Utils = {
  toThreeVec: function(vec) {
    return new THREE.Vector3(vec.x, vec.y, vec.z);
  },
  toCannonVec: function(vec) {
    return new CANNON.Vec3(vec.x, vec.y, vec.z);
  },
  removeElementFromArray(element, array) {
    const index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
  },
};
