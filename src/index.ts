import { setupCanvas, renderTs, renderWasm } from "./render";
import {
  initWasm,
  createWasmSystem,
  getWasmParticleDetailFloats,
  getWasmParticleDetailUInts,
  WasmParticleDetailFloat,
  WasmParticleDetailUInt,
} from "./wasmSetup";

import { System as TSSystem, SystemValuesInit } from "./particles-ts/System";

const CANVAS_WIDTH_BOUND = window.innerWidth - 60;
const CANVAS_HEIGHT_BOUND = window.innerHeight - 60;

// export const particleArrayLength = 4;

initWasm().then(({ System: WasmSystem, wasmMemory }) => {
  const entry = document.getElementById("app")!;
  let [canvas, ctx, stats] = setupCanvas(
    entry,
    CANVAS_WIDTH_BOUND,
    CANVAS_HEIGHT_BOUND
  );

  if (0) {
    const tsSystem = new TSSystem({
      count: 3000,
      dt: 0.005,
      m: 20,
      frictionHalfLife: 100,
    });
    renderTs(ctx, canvas, stats, tsSystem.step, tsSystem.m, tsSystem.particles);
  } else {
    const {
      particleSize,
      particlesFloat,
      particlesUInt,
      m,
      memoryLength,
      step,
    } = createWasmSystem(
      { count: 3000, dt: 0.005, forceFactor: 0.5 },
      WasmSystem,
      wasmMemory
    );

    renderWasm(
      ctx,
      canvas,
      stats,
      step,
      m,
      particlesFloat,
      particlesUInt,
      memoryLength,
      particleSize
    );
  }
});
