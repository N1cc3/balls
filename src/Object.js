import CANNON from 'cannon';

class Object extends CANNON.Body {

  constructor(options) {
    super(options);
    this.mesh = null;
    this.isToBeRemoved = false;
  }

  setVisual(scene, mesh) {
    this.mesh = mesh;
    scene.add(mesh);
  }

  update() {
    // Update mesh according to body
    const pos = this.position;
    this.mesh.position.set(pos.x, pos.y, pos.z);
    const quat = this.quaternion;
    this.mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
  }

  onCollide(callback) {
    this.addEventListener('collide', (e) => {
      callback(e);
    });
  }

  markToBeRemoved() {
    this.isToBeRemoved = true;
  }

}

export default Object;
