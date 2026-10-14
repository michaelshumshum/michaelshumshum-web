<script lang="ts">
import { onMount } from "svelte";

// Grid resolution in logical pixels — smaller = smoother contours, heavier CPU
const CELL_SIZE = 4;
// Number of isoline levels drawn across the field range
const NUM_LEVELS = 16;
// Approximate range of sampleField — sum of the wave amplitudes
const FIELD_MIN = -2.33;
const FIELD_MAX = 2.33;
const LEVEL_STEP = (FIELD_MAX - FIELD_MIN) / NUM_LEVELS;
// 3x screens gain nothing visible over 2x for thin lines, but cost 2.25x the pixels
const MAX_DPR = 2;
// The field drifts slowly, so 30fps looks identical to 60/120fps at a fraction of the cost
const FRAME_INTERVAL = 1000 / 30;

let ctx: CanvasRenderingContext2D | null = null;
let wrapper: HTMLDivElement;
let canvas: HTMLCanvasElement;
let animationId = 0;
let startTime: number | null = null;
let lastDraw = -Infinity;
let visible = false;

// Random phase offsets seeded on mount — different every page load
let phases: number[] = [0, 0, 0, 0, 0];

// Reused buffers — allocated once, resized only on dimension change
let fieldBuffer: Float32Array = new Float32Array(0);
let bufCols = 0;
let bufRows = 0;

const pixelRatio = () => Math.min(window.devicePixelRatio, MAX_DPR);

const resizeCanvas = () => {
	if (!wrapper || !canvas) return;
	const dpr = pixelRatio();
	canvas.width = wrapper.clientWidth * dpr;
	canvas.height = wrapper.clientHeight * dpr;
	canvas.style.width = `${wrapper.clientWidth}px`;
	canvas.style.height = `${wrapper.clientHeight}px`;
};

/** Scalar field — layered sine waves produce organic, flowing "terrain". */
function sampleField(x: number, y: number, t: number): number {
	const nx = x * 0.0042;
	const ny = y * 0.0042;
	return (
		Math.sin(nx * 5.2 + t * 0.45 + phases[0]) * Math.cos(ny * 4.1 + t * 0.35 + phases[1]) +
		0.55 * Math.sin(nx * 8.7 - ny * 5.3 + t * 0.65 + phases[2]) +
		0.35 * Math.cos(nx * 3.1 + ny * 7.4 - t * 0.28 + phases[3]) +
		0.25 * Math.sin((nx - ny) * 9.3 + t * 0.82 + phases[4]) +
		0.18 * Math.cos(nx * 11.1 + ny * 4.7 - t * 0.51 + phases[0])
	);
}

/** Linear interpolation — where on [a→b] does the value cross threshold? */
function edgeLerp(va: number, vb: number, threshold: number): number {
	const d = vb - va;
	if (Math.abs(d) < 1e-10) return 0.5;
	return Math.max(0, Math.min(1, (threshold - va) / d));
}

function seg(x1: number, y1: number, x2: number, y2: number) {
	ctx!.moveTo(x1, y1);
	ctx!.lineTo(x2, y2);
}

/**
 * Marching squares — appends one cell's isoline segment(s) to the current path.
 * Corner bit encoding:  tl=8  tr=4  br=2  bl=1
 */
function traceCell(
	x: number,
	y: number,
	s: number,
	tl: number,
	tr: number,
	br: number,
	bl: number,
	threshold: number,
) {
	const code =
		((tl >= threshold ? 1 : 0) << 3) |
		((tr >= threshold ? 1 : 0) << 2) |
		((br >= threshold ? 1 : 0) << 1) |
		(bl >= threshold ? 1 : 0);

	if (code === 0 || code === 15) return;

	// Interpolated crossing points on each edge
	const topX = x + edgeLerp(tl, tr, threshold) * s;
	const rightY = y + edgeLerp(tr, br, threshold) * s;
	const bottomX = x + edgeLerp(bl, br, threshold) * s;
	const leftY = y + edgeLerp(tl, bl, threshold) * s;
	const right = x + s;
	const bottom = y + s;

	switch (code) {
		case 1:  case 14: seg(x,       leftY, bottomX, bottom); break;
		case 2:  case 13: seg(bottomX, bottom, right,  rightY); break;
		case 3:  case 12: seg(x,       leftY, right,   rightY); break;
		case 4:  case 11: seg(topX,    y,     right,   rightY); break;
		case 6:  case 9:  seg(topX,    y,     bottomX, bottom); break;
		case 7:  case 8:  seg(x,       leftY, topX,    y);      break;
		// Saddle cases — disambiguate by sign of field average
		case 5:
			if ((tl + br) > (tr + bl)) { seg(topX, y, x,     leftY); seg(bottomX, bottom, right, rightY); }
			else                        { seg(topX, y, right, rightY); seg(x, leftY, bottomX, bottom); }
			break;
		case 10:
			if ((tl + br) > (tr + bl)) { seg(topX, y, right, rightY); seg(x, leftY, bottomX, bottom); }
			else                        { seg(topX, y, x,     leftY); seg(bottomX, bottom, right, rightY); }
			break;
	}
}

function draw(timestamp: number) {
	if (!ctx || !canvas) return;

	startTime ??= timestamp;
	const t = (timestamp - startTime) / 1000;
	const dpr = pixelRatio();
	const cellPx = CELL_SIZE * dpr;
	const cols = Math.ceil(canvas.width  / cellPx) + 2;
	const rows = Math.ceil(canvas.height / cellPx) + 2;

	// Resize buffer only when dimensions change
	if (cols !== bufCols || rows !== bufRows) {
		fieldBuffer = new Float32Array(cols * rows);
		bufCols = cols;
		bufRows = rows;
	}

	// Sample the scalar field
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			fieldBuffer[r * cols + c] = sampleField(c * CELL_SIZE, r * CELL_SIZE, t);
		}
	}

	// White background
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Isoline style
	ctx.strokeStyle = "rgba(0,0,0,0.8)";
	ctx.lineWidth = dpr * 1.75;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";

	// Every isoline shares one style, so batch all segments into a single path
	// and stroke once — thousands of individual stroke() calls is what kills mobile GPUs
	ctx.beginPath();
	for (let r = 0; r < rows - 1; r++) {
		for (let c = 0; c < cols - 1; c++) {
			const tl = fieldBuffer[r * cols + c];
			const tr = fieldBuffer[r * cols + c + 1];
			const br = fieldBuffer[(r + 1) * cols + c + 1];
			const bl = fieldBuffer[(r + 1) * cols + c];

			// Only levels between this cell's min and max corner can cross it
			const lo = Math.min(tl, tr, br, bl);
			const hi = Math.max(tl, tr, br, bl);
			const first = Math.max(0, Math.floor((lo - FIELD_MIN) / LEVEL_STEP));
			const last = Math.min(NUM_LEVELS, Math.ceil((hi - FIELD_MIN) / LEVEL_STEP));

			for (let i = first; i <= last; i++) {
				traceCell(c * cellPx, r * cellPx, cellPx, tl, tr, br, bl, FIELD_MIN + i * LEVEL_STEP);
			}
		}
	}
	ctx.stroke();
}

function animation(timestamp: number) {
	// Stop the loop entirely while offscreen — the observer restarts it
	if (!visible) {
		animationId = 0;
		return;
	}
	// Small tolerance so 60Hz displays land on every 2nd frame rather than every 3rd
	if (timestamp - lastDraw >= FRAME_INTERVAL * 0.9) {
		lastDraw = timestamp;
		draw(timestamp);
	}
	animationId = requestAnimationFrame(animation);
}

onMount(() => {
	phases = Array.from({ length: 5 }, () => Math.random() * Math.PI * 2);
	// Opaque canvas — we paint a white background anyway, and it lets the compositor skip blending
	ctx = canvas.getContext("2d", { alpha: false });
	resizeCanvas();

	// IntersectionObserver instead of polling getBoundingClientRect every frame
	const visibilityObserver = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible && !animationId) {
			animationId = requestAnimationFrame(animation);
		}
	});
	visibilityObserver.observe(wrapper);

	const resizeObserver = new ResizeObserver(() => {
		resizeCanvas();
		// Resizing clears the canvas — force a redraw on the next frame
		lastDraw = -Infinity;
	});
	resizeObserver.observe(wrapper);

	return () => {
		cancelAnimationFrame(animationId);
		visibilityObserver.disconnect();
		resizeObserver.disconnect();
	};
});
</script>

<div bind:this={wrapper} class="topo-canvas">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.topo-canvas {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	canvas {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
