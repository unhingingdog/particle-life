import { Particle } from "./particles-ts/Particle";
import { WasmParticleDetailFloat, WasmParticleDetailUInt } from "./wasmSetup";

export const setupCanvas = (
  parent: HTMLElement,
  width: number,
  height: number,
  button: HTMLButtonElement,
  title: HTMLElement
): [HTMLCanvasElement, CanvasRenderingContext2D, HTMLDivElement] => {
  const canvas = document.createElement("canvas")!;
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "1px solid black";
  canvas.style.margin = "30px";

  const stats = document.createElement("div");
  stats.innerHTML = "render time per frame: ";

  parent.appendChild(canvas);
  parent.appendChild(title);
  parent.appendChild(button);
  parent.appendChild(stats);

  return [canvas, canvas.getContext("2d")!, stats];
};

const drawParticle = (
  x: number,
  y: number,
  radius: number,
  color: number,
  m: number,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.beginPath();
  const xScreen = (x * canvas.width) % canvas.width;
  const yScreen = (y * canvas.height) % canvas.height;
  ctx.arc(xScreen, yScreen, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = `hsl(${color * (360 / m)}, 80%, 50%)`; // Assuming color is a hue value in HSL
  ctx.fill();
};

export const drawParticlesTs = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  m: number,
  particles: Particle[]
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    const {
      position: [x, y],
      radius,
      color,
    } = particle as Particle;
    drawParticle(x, y, radius, color, m, ctx, canvas);
  }
};

export const drawParticlesWasm = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  m: number,
  particlesFloats: Float32Array,
  particlesUInts: Uint32Array,
  particleArrayLength: number,
  particleSize: number
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particleArrayLength; i += particleSize) {
    const x = particlesFloats[i + WasmParticleDetailFloat.x];
    const y = particlesFloats[i + WasmParticleDetailFloat.y];
    const radius = particlesFloats[i + WasmParticleDetailFloat.radius];
    const color = particlesUInts[i + WasmParticleDetailUInt.color];

    drawParticle(x, y, radius, color, m, ctx, canvas);
  }
};

interface RunningFlag {
  running: boolean;
}

export const renderTs = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stats: HTMLDivElement,
  onRenderFrame: () => void,
  m: number,
  particles: Particle[],
  running: RunningFlag
) => {
  const drawStart = performance.now();
  drawParticlesTs(ctx, canvas, m, particles as Particle[]);
  const drawTime = performance.now() - drawStart;

  const engineStart = performance.now();
  onRenderFrame();
  const engineTime = performance.now() - engineStart;

  stats.innerHTML =
    "render time per frame (ms): " +
    drawTime +
    "<br />" +
    "processing time per step (ms): " +
    engineTime;

  if (running.running) {
    requestAnimationFrame(() => {
      renderTs(ctx, canvas, stats, onRenderFrame, m, particles, running);
    });
  }
};

export const renderWasm = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  stats: HTMLDivElement,
  onRenderFrame: () => void,
  m: number,
  particlesFloats: Float32Array,
  particlesUInts: Uint32Array,
  particleArraylength: number,
  particleSize: number,
  running: RunningFlag
) => {
  const drawStart = performance.now();
  drawParticlesWasm(
    ctx,
    canvas,
    m,
    particlesFloats,
    particlesUInts,
    particleArraylength,
    particleSize
  );
  const drawTime = performance.now() - drawStart;

  const engineStart = performance.now();
  onRenderFrame();
  const engineTime = performance.now() - engineStart;

  stats.innerHTML =
    "render time per frame (ms): " +
    drawTime +
    "<br />" +
    "processing time per step (ms): " +
    engineTime;

  if (running.running) {
    requestAnimationFrame(() => {
      renderWasm(
        ctx,
        canvas,
        stats,
        onRenderFrame,
        m,
        particlesFloats,
        particlesUInts,
        particleArraylength,
        particleSize,
        running
      );
    });
  }
};
