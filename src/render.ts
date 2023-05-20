import { Particle } from "./particles-ts/Particle";
import { WasmParticleDetailFloat, WasmParticleDetailUInt } from "./wasmSetup";

export const setupCanvas = (
  parent: HTMLElement,
  width: number,
  height: number
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement("canvas")!;
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = "1px solid black";
  canvas.style.margin = "30px";
  parent.appendChild(canvas);
  return [canvas, canvas.getContext("2d")!];
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
  const yScreen = (y * canvas.height) % canvas.width;
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

export const renderTs = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  onRenderFrame: () => void,
  m: number,
  particles: Particle[]
) => {
  drawParticlesTs(ctx, canvas, m, particles as Particle[]);
  onRenderFrame();

  requestAnimationFrame(() => {
    renderTs(ctx, canvas, onRenderFrame, m, particles);
  });
};

export const renderWasm = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  onRenderFrame: () => void,
  m: number,
  particlesFloats: Float32Array,
  particlesUInts: Uint32Array,
  particleArraylength: number,
  particleSize: number
) => {
  drawParticlesWasm(
    ctx,
    canvas,
    m,
    particlesFloats,
    particlesUInts,
    particleArraylength,
    particleSize
  );
  onRenderFrame();

  requestAnimationFrame(() => {
    renderWasm(
      ctx,
      canvas,
      onRenderFrame,
      m,
      particlesFloats,
      particlesUInts,
      particleArraylength,
      particleSize
    );
  });
};
