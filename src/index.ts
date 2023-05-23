import { setupCanvas, renderTs, renderWasm } from "./render";
import { initWasm, createWasmSystem } from "./wasmSetup";

import { System as TSSystem, SystemValuesInit } from "./particles-ts/System";

const CANVAS_WIDTH_BOUND = window.innerWidth - 60;
const CANVAS_HEIGHT_BOUND = window.innerHeight - 60;

const entry = document.getElementById("app")!;

const label = document.createElement("p");
label.innerHTML =
  "enter particle count (note this could be slow for >1000 particles)";
const input = document.createElement("input");
input.value = "200";
const startButton = document.createElement("button");
startButton.innerHTML = "start";
const b = document.createElement("br");
const subLabel = document.createElement("small");
subLabel.innerHTML =
  "Creates a particle-based version of Conway's game of life, with a random rule-set each time.";

entry.appendChild(label);
entry.appendChild(input);
entry.appendChild(startButton);
entry.appendChild(b);
entry.appendChild(subLabel);

const setup = () => {
  console.log("here");
  const particleCount = parseInt(input.value, 10);
  if (Number.isNaN(particleCount) || particleCount < 0) {
    label.innerHTML = "enter a valid number";
    return;
  }

  entry.removeChild(label);
  entry.removeChild(input);
  entry.removeChild(startButton);
  entry.removeChild(b);
  entry.removeChild(subLabel);

  initWasm().then(({ System: WasmSystem, wasmMemory }) => {
    let wasmOn = false;

    const systemInputs: Partial<SystemValuesInit> = {
      count: particleCount,
      dt: 0.005,
      m: 10,
      forceFactor: 0.3,
    };

    const tsSystem = new TSSystem(systemInputs);
    const tsSystemRenderRunning = { running: true };

    const {
      particleSize,
      particlesFloat,
      particlesUInt,
      m,
      memoryLength,
      step,
      start: wasmStart,
      pause: wasmPause,
    } = createWasmSystem(systemInputs, WasmSystem, wasmMemory);
    const wasmSystemRenderRunning = { running: false };

    const modeButton = document.createElement("button");
    modeButton.innerHTML = wasmOn ? "switch to js" : "switch to rust/wasm";
    modeButton.id = "mode-button";

    const title = document.createElement("h4");

    let [canvas, ctx, stats] = setupCanvas(
      entry,
      CANVAS_WIDTH_BOUND,
      CANVAS_HEIGHT_BOUND,
      modeButton,
      title
    );

    const startWasm = () => {
      tsSystem.pause();
      tsSystemRenderRunning.running = false;

      wasmStart();
      wasmSystemRenderRunning.running = true;
      wasmOn = true;

      modeButton.innerHTML = "switch to JavaScript";
      const count = systemInputs.count ?? 0;
      title.innerHTML = `Running on Rust/WASM with ${count} particles (${
        count ** 2
      } interactions per step)`;

      renderWasm(
        ctx,
        canvas,
        stats,
        step,
        m,
        particlesFloat,
        particlesUInt,
        memoryLength,
        particleSize,
        wasmSystemRenderRunning
      );
    };

    const startTs = () => {
      wasmPause();
      wasmSystemRenderRunning.running = false;
      wasmOn = false;

      tsSystem.start();
      tsSystemRenderRunning;
      tsSystemRenderRunning.running = true;

      modeButton.innerHTML = "switch to Rust/WASM";
      const count = systemInputs.count ?? 0;
      title.innerHTML = `Running on JavaScript with ${count} particles (${
        count ** 2
      } interactions per step)`;

      renderTs(
        ctx,
        canvas,
        stats,
        tsSystem.step,
        tsSystem.m,
        tsSystem.particles,
        tsSystemRenderRunning
      );
    };

    modeButton.addEventListener("click", () => {
      if (wasmOn) {
        startTs();
      } else {
        startWasm();
      }
    });

    if (wasmOn) {
      startWasm();
    } else {
      startTs();
    }
  });
};

startButton.addEventListener("click", setup);
