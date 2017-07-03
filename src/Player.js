import CANNON from 'cannon';
import Ball from './objects/Ball';

const DEADZONE_DISTANCE = 5;

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

    // Remove balls too far from center
    for (const ball of this.balls) {
      const distance = this.position.distanceTo(ball.position);
      if (distance > DEADZONE_DISTANCE) {
        ball.markToBeRemoved();
      }
    }
  }

  addPoints(points) {
    this.points += points;
  }

  /**
   * Checks if given Object is in this.balls and removes it if found.
   * @param {Object} ball
   */
  removeBall(ball) {
    const index = this.balls.indexOf(ball);
    if (index > -1) {
      this.balls.splice(index, 1);
    }
  }

}

export default Player;
