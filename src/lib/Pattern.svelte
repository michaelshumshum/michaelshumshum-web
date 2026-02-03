<script lang="ts">
import { onMount } from "svelte";
import { windowSize } from "./common/stores";
import { incrementLoadingSemaphore } from "./common/utils";

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

onMount(() => {
	createTexts().then(() => {
		decrement();
		animation();
	});
	windowSize.subscribe((w) => {
		if (canvas) {
			canvas.width = w.width * window.devicePixelRatio;
			canvas.height = w.height * window.devicePixelRatio;
		}
	});
	animation();
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
