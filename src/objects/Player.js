import * as THREE from 'three';
import CANNON from 'cannon';
import Ball from './Ball';

class Player {

  constructor(n, r, segments, color) {
    this.n = n;
    this.balls = [];
    this.position = new CANNON.Vec3();

    for (let i = 0; i < n; i++) {
      const ball = new Ball(r, segments, color);
      ball.position.set(0, 0.1, 0.2*(i + 1));
      this.balls.push(ball);
    }
  }

  update() {
    let center = new CANNON.Vec3();
    for (const ball of this.balls) {
      // ball.update();
      //console.log(center);
      center = center.vadd(ball.position);
    }
    console.log(center);
    center.scale(1/this.n);
    this.position = center;
  }

}

export default Player;
