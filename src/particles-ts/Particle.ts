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
    // console.log("applying force", `[${force[0]}, ${force[1]}]`);
    vec2.add(this.acceleration, this.acceleration, force);
  };

  public applyDrag = (dragFactor: number) => {
    vec2.scale(this.velocity, this.velocity, dragFactor);
  };

  // public getDistanceToNeighbor = (otherParticle: Particle): number => {
  //   return vec2.distance(this.position, otherParticle.position);
  // };

  public getDistanceToNeighbor = (otherParticle: Particle): number => {
    const dx = this.position[0] - otherParticle.position[0];
    const dy = this.position[1] - otherParticle.position[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  public move = (dt: number) => {
    vec2.add(this.velocity, this.velocity, this.acceleration);
    const timeStepped = vec2.scale(vec2.create(), this.velocity, dt);
    vec2.add(this.position, this.position, timeStepped);
    vec2.set(this.acceleration, 0, 0);
  };

  // a float from 0 to 1
  public static generateColor = (m: number, inputValue: number) => {
    const constrainedValue = Math.min(1, inputValue, Math.max(0, inputValue));
    return Math.floor(constrainedValue * m);
  };

  public static initRandom(id: number, m: number): Particle {
    const position = vec2.fromValues(Math.random(), Math.random());
    const color = Particle.generateColor(m, Math.random());
    return new Particle(position, color, 3, id);
  }
}
