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
    console.log("friction factor", this.frictionFactor);
    this.ruleMatrix = System.makeRandomRulesMatrix(this.m);
    console.log(this.ruleMatrix, "size", this.m);
    console.log("dt", this.dt);
    console.log("force factor", this.forceFactor);
    console.log("r max", this.rMax);

    this.particles = new Array(this.count)
      .fill(0)
      .map((_, id) => Particle.initRandom(id, this.m));

    // const particle1 = new Particle([0.1, 0.1], 1, 1, 1);
    // const particle2 = new Particle([0.09, 0.09], 1, 2, 2);
    // this.particles = [particle1, particle2];

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

        const pPosition = particle.position;
        const nPosition = neighbor.position;
        const rx = nPosition[0] - pPosition[0];
        const ry = nPosition[1] - pPosition[1];

        // console.log("p position", particle.position[0], particle.position[1]);
        // console.log("n position", neighbor.position[0], neighbor.position[1]);
        // console.log("rx", rx);
        // console.log("ry", ry);

        const distance = particle.getDistanceToNeighbor(neighbor);
        // console.log("distance", distance);

        if (distance > 0 && distance < this.rMax) {
          const normalizedDistance = distance / this.rMax;
          // console.log("normalised distance", normalizedDistance);
          const ruleValue = this.ruleMatrix[particle.color][neighbor.color];
          // console.log("rule value", ruleValue);
          // console.log("rule value", ruleValue);

          const force = System.getRuleForce(normalizedDistance, ruleValue);
          // console.log("rule force", force);

          totalForce[0] += (rx / distance) * force;
          totalForce[1] += (ry / distance) * force;
        }
      }

      // console.log("total force after rule force", totalForce[0], totalForce[1]);
      vec2.scale(totalForce, totalForce, this.forceFactor * this.rMax);
      // console.log("total force after scale", totalForce[0], totalForce[1]);
      vec2.scaleAndAdd(totalForce, totalForce, totalForce, this.dt);
      // console.log("total force after dt scale", totalForce[0], totalForce[1]);
      particle.applyDrag(this.frictionFactor);
      particle.applyForce(totalForce);
    }
  };

  step = () => {
    this.applyForces();
    for (const particle of this.particles) {
      particle.move(this.dt);
    }
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

  static makeRandomRulesMatrix = (m: number): number[][] => {
    const rows = [];
    for (let i = 0; i < m; i++) {
      const row = [];
      for (let i = 0; i < m; i++) {
        row.push(Math.random() * 2 - 1);
        // row.push(0.5);
      }
      rows.push(row);
    }
    return rows;
  };
}
