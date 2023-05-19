import { setupCanvas, render } from "./render";
import { initWasm } from "./wasmSetup";

import { System } from "./particles-ts/System";

const CANVAS_WIDTH_BOUND = window.innerWidth - 60;
const CANVAS_HEIGHT_BOUND = window.innerHeight - 60;

export const particleArrayLength = 4;

initWasm().then(([floats, ints]) => {
  console.log("floats", floats);
  console.log("ints", ints);
});

const entry = document.getElementById("app")!;
let [canvas, ctx] = setupCanvas(entry, CANVAS_WIDTH_BOUND, CANVAS_HEIGHT_BOUND);

const particles = [200, 200, 10, 100, 100, 100, 20, 180];

const system = new System({ count: 1000 });

render(ctx, canvas, system.step, system.m, system.particles, 0);
