<script lang="ts">
import { onMount } from "svelte";
import { windowSize } from "./common/stores";
import { elementVisible } from "./common/utils";

// Grid resolution in logical pixels — smaller = smoother contours, heavier CPU
const CELL_SIZE = 4;
// Number of isoline levels drawn across the field range
const NUM_LEVELS = 16;

let ctx: CanvasRenderingContext2D | null = null;
let wrapper: HTMLDivElement;
let canvas: HTMLCanvasElement;
let animationId: number;
let startTime = 0;

// Random phase offsets seeded on mount — different every page load
let phases: number[] = [0, 0, 0, 0, 0];

// Reused buffers — allocated once, resized only on dimension change
let fieldBuffer: Float32Array = new Float32Array(0);
let bufCols = 0;
let bufRows = 0;

const resizeCanvas = () => {
	if (!wrapper || !canvas) return;
	canvas.width = wrapper.clientWidth * window.devicePixelRatio;
	canvas.height = wrapper.clientHeight * window.devicePixelRatio;
	canvas.style.width = `${wrapper.clientWidth}px`;
	canvas.style.height = `${wrapper.clientHeight}px`;
};

windowSize.subscribe(() => resizeCanvas());

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
	// approximate range: [-2.33, 2.33]
}

/** Linear interpolation — where on [a→b] does the value cross threshold? */
function edgeLerp(va: number, vb: number, threshold: number): number {
	const d = vb - va;
	if (Math.abs(d) < 1e-10) return 0.5;
	return Math.max(0, Math.min(1, (threshold - va) / d));
}

/**
 * Marching squares — draws one isoline layer onto ctx.
 * Corner bit encoding:  tl=8  tr=4  br=2  bl=1
 */
function drawIsoline(cols: number, rows: number, cellPx: number, threshold: number) {
	if (!ctx) return;

	for (let r = 0; r < rows - 1; r++) {
		for (let c = 0; c < cols - 1; c++) {
			const tl = fieldBuffer[r * cols + c];
			const tr = fieldBuffer[r * cols + c + 1];
			const br = fieldBuffer[(r + 1) * cols + c + 1];
			const bl = fieldBuffer[(r + 1) * cols + c];

			const code =
				((tl >= threshold ? 1 : 0) << 3) |
				((tr >= threshold ? 1 : 0) << 2) |
				((br >= threshold ? 1 : 0) << 1) |
				(bl >= threshold ? 1 : 0);

			if (code === 0 || code === 15) continue;

			const x = c * cellPx;
			const y = r * cellPx;
			const s = cellPx;

			// Interpolated crossing points on each edge
			const topPt    = { x: x + edgeLerp(tl, tr, threshold) * s, y };
			const rightPt  = { x: x + s,                                y: y + edgeLerp(tr, br, threshold) * s };
			const bottomPt = { x: x + edgeLerp(bl, br, threshold) * s, y: y + s };
			const leftPt   = { x,                                       y: y + edgeLerp(tl, bl, threshold) * s };

			ctx.beginPath();

			switch (code) {
				case 1:  case 14: seg(leftPt,   bottomPt); break;
				case 2:  case 13: seg(bottomPt, rightPt);  break;
				case 3:  case 12: seg(leftPt,   rightPt);  break;
				case 4:  case 11: seg(topPt,    rightPt);  break;
				case 6:  case 9:  seg(topPt,    bottomPt); break;
				case 7:  case 8:  seg(leftPt,   topPt);    break;
				// Saddle cases — disambiguate by sign of field average
				case 5:
					if ((tl + br) > (tr + bl)) { seg(topPt, leftPt);   ctx.stroke(); ctx.beginPath(); seg(bottomPt, rightPt); }
					else                        { seg(topPt, rightPt);  ctx.stroke(); ctx.beginPath(); seg(leftPt,   bottomPt); }
					break;
				case 10:
					if ((tl + br) > (tr + bl)) { seg(topPt, rightPt);  ctx.stroke(); ctx.beginPath(); seg(leftPt,   bottomPt); }
					else                        { seg(topPt, leftPt);   ctx.stroke(); ctx.beginPath(); seg(bottomPt, rightPt); }
					break;
			}

			ctx.stroke();
		}
	}
}

function seg(a: { x: number; y: number }, b: { x: number; y: number }) {
	ctx!.moveTo(a.x, a.y);
	ctx!.lineTo(b.x, b.y);
}

function draw(timestamp: number) {
	if (!ctx || !canvas) return;

	const t = (timestamp - startTime) / 1000;
	const dpr = window.devicePixelRatio;
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

	// Draw equally-spaced isolines across the field range
	const fieldMin = -2.33;
	const fieldMax = 2.33;
	for (let i = 0; i <= NUM_LEVELS; i++) {
		const threshold = fieldMin + (i / NUM_LEVELS) * (fieldMax - fieldMin);
		drawIsoline(cols, rows, cellPx, threshold);
	}
}

function animation(timestamp: number) {
	if (wrapper && elementVisible(wrapper)) {
		draw(timestamp);
	}
	animationId = requestAnimationFrame(animation);
}

onMount(() => {
	phases = Array.from({ length: 5 }, () => Math.random() * Math.PI * 2);
	ctx = canvas.getContext("2d");
	resizeCanvas();
	animationId = requestAnimationFrame((ts) => {
		startTime = ts;
		animation(ts);
	});
	return () => cancelAnimationFrame(animationId);
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
