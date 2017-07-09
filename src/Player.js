import CANNON from 'cannon';
import Ball from './objects/Ball';

class Player {

  constructor(n, r, segments, color) {
    this.balls = [];
    this.position = new CANNON.Vec3();
    this.points = 0;

    const d = 2*r;
    for (let i = 0; i < n; i++) {
      const ball = new Ball(r, segments, color);
      ball.position.set(d*Math.cos(Math.PI*(i/2))*Math.ceil(i/4), 0.1, 0.2 + d*Math.sin(Math.PI*(i/2))*Math.ceil(i/4));

      this.balls.push(ball);
    }
    this.update();
  }

  update() {
    let center = new CANNON.Vec3();
    for (const ball of this.balls) {
      center = center.vadd(ball.position);
    }
    center = center.scale(1/this.balls.length);
    this.position = center;
  }

  addPoints(points) {
    this.points += points;
  }

}

export default Player;
