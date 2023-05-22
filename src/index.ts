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

export const particleArrayLength = 4;

initWasm().then(({ System: WasmSystem, wasmMemory }) => {
  const entry = document.getElementById("app")!;
  let [canvas, ctx] = setupCanvas(
    entry,
    CANVAS_WIDTH_BOUND,
    CANVAS_HEIGHT_BOUND
  );

  if (false) {
    const tsSystem = new TSSystem({ count: 10 });
    renderTs(ctx, canvas, tsSystem.step, tsSystem.m, tsSystem.particles);
  } else {
    const {
      particleSize,
      particlesFloat,
      particlesUInt,
      m,
      memoryLength,
      step,
    } = createWasmSystem({ count: 10 }, WasmSystem, wasmMemory);

    renderWasm(
      ctx,
      canvas,
      step,
      m,
      particlesFloat,
      particlesUInt,
      memoryLength,
      particleSize
    );
  }
});
