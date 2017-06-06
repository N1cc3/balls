import CANNON from 'cannon';

class Object extends CANNON.Body {

  constructor(options) {
    super(options);
    this.mesh = null;
  }

  setVisual(scene, mesh) {
    this.mesh = mesh;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
  }

  update() {
    // Update mesh according to body
    let pos = this.position;
    this.mesh.position.set(pos.x, pos.y, pos.z);
    let quat = this.quaternion;
    this.mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
  }

  onCollide(callback) {
    this.addEventListener('collide', function(e) {
      callback(e);
    });
  }

}

export default Object;
