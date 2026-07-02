<script lang="ts">
import { onMount } from "svelte";
import { incrementLoadingSemaphore } from "../utils";

const decrement = incrementLoadingSemaphore();

const _font_size = 8;
const _text_length = 500;

let { baseText }: { baseText: string } = $props();

const texts: string[] = [];
let canvas: HTMLCanvasElement;
let currentIndex = 0;

async function createTexts() {
	const text = `${baseText} `.repeat(_text_length / baseText.length);
	for (let i = 0; i < baseText.length + 1; i++) {
		texts.push(text.slice(i, i + _text_length));
	}
}

function animation() {
	currentIndex = (currentIndex + 1) % texts.length;

	const ctx = canvas.getContext("2d");
	if (!ctx) {
		return;
	}

	// clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgba(0,0,0,0.2)";
	ctx.font = `${_font_size * window.devicePixelRatio}px monospace`;
	for (let i = 0; i < Math.ceil(canvas.height / _font_size); i++) {
		ctx.fillText(
			texts[(currentIndex + i) % texts.length],
			0,
			i * _font_size * window.devicePixelRatio,
		);
	}

	setTimeout(() => {
		requestAnimationFrame(animation);
	}, 100);
}

function resizeCanvas() {
	canvas.width = canvas.clientWidth * window.devicePixelRatio;
	canvas.height = canvas.clientHeight * window.devicePixelRatio;
}

onMount(() => {
	resizeCanvas();

	// Observing the canvas's own box (rather than `window`'s resize event)
	// means mobile Safari toggling its toolbar during scroll — which fires
	// `resize` without actually changing the canvas's 100vw/100vh layout
	// size — no longer forces an expensive backing-store reallocation
	// mid-scroll. Same fix already applied to MatrixCanvas/HeatmapCanvas.
	const observer = new ResizeObserver(resizeCanvas);
	observer.observe(canvas);

	createTexts().then(() => {
		decrement();
		animation();
	});

	return () => observer.disconnect();
});
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: 50% 50%;
  }
</style>
