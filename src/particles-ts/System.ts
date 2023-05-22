import { glMatrix, vec2 } from "gl-matrix";
import { Particle } from "./Particle";

glMatrix.setMatrixArrayType(Float32Array);

export const defaults = {
  n: 1000,
  dt: 0.01,
  frictionHalfLife: 0.06,
  rMax: 0.1,
  m: 6,
  forceFactor: 1,
};

const getFrictionFactor = (dt: number, frictionHalfLife: number) =>
  Math.pow(0.5, dt / frictionHalfLife);

export interface SystemValuesInit {
  count: number;
  dt: number;
  frictionHalfLife: number;
  rMax: number;
  m: number;
  forceFactor: number;
}

interface WorkingVec {
  vec: vec2;
  locked: boolean;
}

export class System {
  public count: number;
  public dt: number;
  public frictionHalfLife: number;
  public rMax: number;

  public frictionFactor: number;
  public m: number;
  public ruleMatrix: number[][];
  public forceFactor: number;

  public particles: Particle[];

  private workingVec: WorkingVec;

  constructor({
    count,
    dt,
    frictionHalfLife,
    rMax,
    m,
    forceFactor,
  }: Partial<SystemValuesInit>) {
    this.count = count || defaults.n;
    this.dt = dt || defaults.dt;
    this.frictionHalfLife = frictionHalfLife || defaults.frictionHalfLife;
    this.rMax = rMax || defaults.rMax;
    this.m = m || defaults.m;
    this.forceFactor = forceFactor || defaults.forceFactor;

    this.frictionFactor = getFrictionFactor(this.dt, this.frictionHalfLife);
    this.ruleMatrix = System.makeRandomRulesMatrix(this.m);

    this.particles = new Array(this.count)
      .fill(0)
      .map((_, id) => Particle.initRandom(id, this.m));

    this.workingVec = { vec: vec2.create(), locked: false };
  }

  private useWorkingVec = () => {
    if (this.workingVec.locked) {
      throw new Error("using locked vector");
    }
    this.workingVec.locked = true;
    return this.workingVec;
  };

  private freeWorkingVec = (workingVec: WorkingVec) => {
    if (!workingVec.locked) {
      throw new Error("freeing unlocked vec");
    }
    workingVec.locked = false;
  };

  applyForces = () => {
    for (const particle of this.particles) {
      const totalForce = vec2.create();

      for (const neighbor of this.particles) {
        if (particle.id === neighbor.id) continue;
        const rx = neighbor.position[0] - particle.position[0];
        const ry = neighbor.position[1] - particle.position[1];
        const distance = particle.getDistanceToNeighbor(neighbor);
        console.log("distance", distance);

        if (distance > 0 && distance < this.rMax) {
          const f = Particle.getRuleForce(
            distance / this.rMax,
            this.ruleMatrix[particle.color][neighbor.color]
          );
          totalForce[0] += (rx / distance) * f;
          totalForce[1] += (ry / distance) * f;
        }
      }

      vec2.scale(totalForce, totalForce, this.forceFactor * this.rMax);

      particle.applyDrag(this.frictionFactor);

      vec2.scaleAndAdd(totalForce, totalForce, totalForce, this.dt);

      // totalForce[0] += totalForce[0] * this.dt;
      // totalForce[1] += totalForce[1] * this.dt;

      particle.applyForce(totalForce);
    }
  };

  step = () => {
    this.applyForces();
    for (const particle of this.particles) {
      particle.move(this.dt);
    }
  };

  static makeRandomRulesMatrix = (m: number): number[][] => {
    const rows = [];
    for (let i = 0; i < m; i++) {
      const row = [];
      for (let i = 0; i < m; i++) {
        row.push(Math.random() * 2 - 1);
      }
      rows.push(row);
    }
    return rows;
  };
}
