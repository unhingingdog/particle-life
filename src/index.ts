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

  const tsSystem = new TSSystem({ count: 1000 });
  const { particleSize, particlesFloat, particlesUInt, m, memoryLength } =
    createWasmSystem({}, WasmSystem, wasmMemory);

  renderWasm(
    ctx,
    canvas,
    () => console.log("stepped"),
    m,
    particlesFloat,
    particlesUInt,
    memoryLength,
    particleSize
  );

  // renderTs(ctx, canvas, tsSystem.step, tsSystem.m, tsSystem.particles);
});
