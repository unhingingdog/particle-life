import { Particle } from "./particles-ts/Particle";

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

export const drawParticles = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  m: number,
  particles: Particle[] | number[],
  particleArrayLength: number = 0
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (typeof particles[0] === "number") {
    if (particleArrayLength === 0) {
      throw new Error("no particle array length");
    }

    for (let i = 0; i < particles.length; i += particleArrayLength) {
      const x = particles[i] as number;
      const y = particles[i + 1] as number;
      const radius = particles[i + 2] as number;
      const color = particles[i + 3] as number;
      drawParticle(x, y, radius, color, m, ctx, canvas);
    }
  } else {
    for (const particle of particles) {
      const {
        position: [x, y],
        radius,
        color,
      } = particle as Particle;
      drawParticle(x, y, radius, color, m, ctx, canvas);
    }
  }
};

export const render = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  onRenderFrame: () => void,
  m: number,
  particles: Particle[] | number[],
  particleArrayLength: number = 0
) => {
  drawParticles(ctx, canvas, m, particles, particleArrayLength);
  onRenderFrame();

  requestAnimationFrame(() => {
    render(ctx, canvas, onRenderFrame, m, particles, particleArrayLength);
  });
};
