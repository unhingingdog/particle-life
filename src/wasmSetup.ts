import init, { greet, System as WasmSystem, wasm_memory } from "particles-wasm";
import { SystemValuesInit, defaults } from "./particles-ts/System";

// maps to offset in 32bit Particle memory
export enum WasmParticleDetailFloat {
  x = 0,
  y = 1,
  radius = 6,
}

export enum WasmParticleDetailUInt {
  color = 7,
  id = 8,
}

export const getWasmParticleDetailFloats = (
  floats: Float32Array,
  particleSize: number,
  index: number,
  detail: WasmParticleDetailFloat
) => {
  const scaledIndex = particleSize * index;
  return floats[scaledIndex + detail];
};

export const getWasmParticleDetailUInts = (
  uInts: Uint32Array,
  particleSize: number,
  index: number,
  detail: WasmParticleDetailUInt
) => {
  const scaledIndex = particleSize * index;
  return uInts[scaledIndex + detail];
};

export const createWasmSystem = (
  init: Partial<SystemValuesInit>,
  System: typeof WasmSystem,
  memory: any
) => {
  const system = new System(
    init.count || defaults.n,
    init.dt || defaults.dt,
    init.frictionHalfLife || defaults.frictionHalfLife,
    init.rMax || defaults.rMax,
    init.m || defaults.m,
    init.forceFactor || defaults.forceFactor
  );

  const structPointer = system.get_particles_state();
  const memoryLength = system.get_particles_memory_length();
  const m = system.get_m();
  const particleSize = WasmSystem.get_particle_size();

  const particlesFloat = new Float32Array(
    memory().buffer,
    structPointer,
    memoryLength
  );

  const particlesUInt = new Uint32Array(
    memory().buffer,
    structPointer,
    memoryLength
  );

  const step = system.step.bind(system);
  const start = system.start.bind(system);
  const pause = system.pause.bind(system);

  return {
    particlesFloat,
    particlesUInt,
    particleSize,
    m,
    memoryLength,
    step,
    start,
    pause,
  };
};

export const initWasm = async () => {
  await init();

  return { System: WasmSystem, wasmMemory: wasm_memory };
};
