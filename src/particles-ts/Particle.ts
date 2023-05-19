import { glMatrix, vec2 } from "gl-matrix";

glMatrix.setMatrixArrayType(Float32Array);

export class Particle {
  public position: vec2;
  public velocity: vec2;
  private acceleration: vec2;

  public radius: number;
  public color: number;

  id: number;

  constructor(
    initialPosition: vec2,
    color: number,
    radius: number,
    id: number,
    initialXV?: number,
    initialYV?: number
  ) {
    this.position = initialPosition;
    this.velocity = vec2.fromValues(initialXV || 0, initialYV || 0);
    this.acceleration = vec2.fromValues(0, 0);
    this.radius = radius;
    this.color = color;
    this.id = id;
  }

  public applyForce = (force: vec2) => {
    vec2.add(this.acceleration, this.acceleration, force);
  };

  public applyDrag = (dragFactor: number) => {
    vec2.scale(this.velocity, this.velocity, dragFactor);
  };

  public getDistanceToNeighbor = (otherParticle: Particle): number => {
    return vec2.distance(this.position, otherParticle.position);
  };

  public getDirectionToNeighbor = (
    otherParticle: Particle,
    destVec: vec2
  ): vec2 => {
    return vec2.subtract(destVec, otherParticle.position, this.position);
    vec2.normalize(destVec, destVec);
  };

  public move = (dt: number) => {
    vec2.add(this.velocity, this.velocity, this.acceleration);
    const timeStepped = vec2.scale(vec2.create(), this.velocity, dt);
    vec2.add(this.position, this.position, timeStepped);
    vec2.set(this.acceleration, 0, 0);
  };

  public static getRuleForce = (
    normalizedDistance: number,
    ruleValue: number
  ): number => {
    const beta = 0.3;
    if (normalizedDistance < beta) {
      return normalizedDistance / beta - 1;
    } else if (beta < normalizedDistance && normalizedDistance < 1) {
      return (
        ruleValue *
        (1 - Math.abs(2 * normalizedDistance - 1 - beta) / (1 - beta))
      );
    } else {
      return 0;
    }
  };

  // a float from 0 to 1
  public static generateColor = (m: number, inputValue: number) => {
    const constrainedValue = Math.min(1, inputValue, Math.max(0, inputValue));
    return Math.floor(constrainedValue * m);
  };

  public static initRandom(id: number, m: number): Particle {
    const position = vec2.fromValues(Math.random(), Math.random());
    const color = Particle.generateColor(m, Math.random());
    return new Particle(position, color, 2, id);
  }
}
