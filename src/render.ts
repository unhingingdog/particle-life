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
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = `hsl(${color}, 50%, 50%)`; // Assuming color is a hue value in HSL
  ctx.fill();
};

export const drawPoints = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particleArrayLength: number,
  particles: number[]
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particles.length; i += particleArrayLength) {
    const x = particles[i];
    const y = particles[i + 1];
    const radius = particles[i + 2];
    const color = particles[i + 3];
    drawParticle(x, y, radius, color, ctx);
  }
};

export const render = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particleArrayLength: number,
  particles: number[]
) => {
  drawPoints(ctx, canvas, particleArrayLength, particles);
  requestAnimationFrame(() =>
    render(ctx, canvas, particleArrayLength, particles)
  );
};
