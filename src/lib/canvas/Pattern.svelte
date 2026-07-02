<script lang="ts">
import { onMount } from "svelte";
import { incrementLoadingSemaphore } from "../utils";

const decrement = incrementLoadingSemaphore();

const _font_size = 8;
const _text_length = 500;
const _step_ms = 100;

let { baseText }: { baseText: string } = $props();

// The animation shifts every row's text window by one character per tick,
// which is exactly equivalent to the whole image scrolling up one row per
// tick with period `cycle` (= baseText.length + 1). So instead of
// re-rasterizing a full-screen canvas 10x/second (a main-thread +
// texture-upload cost that caused jank on mobile), draw the pattern once
// into a buffer one cycle taller than the viewport and loop a
// compositor-only CSS steps() transform over it.
const texts: string[] = [];
let canvas: HTMLCanvasElement;

function createTexts() {
	const text = `${baseText} `.repeat(_text_length / baseText.length);
	for (let i = 0; i < baseText.length + 1; i++) {
		texts.push(text.slice(i, i + _text_length));
	}
}

function draw() {
	const parent = canvas.parentElement;
	const ctx = canvas.getContext("2d");
	if (!parent || !ctx) {
		return;
	}

	const dpr = window.devicePixelRatio;
	const cycle = texts.length;
	const rows = Math.ceil(parent.clientHeight / _font_size) + cycle;
	canvas.width = parent.clientWidth * dpr;
	canvas.height = rows * _font_size * dpr;
	canvas.style.height = `${rows * _font_size}px`;
	canvas.style.setProperty("--cycle-shift", `-${cycle * _font_size}px`);
	canvas.style.animationDuration = `${cycle * _step_ms}ms`;
	canvas.style.animationTimingFunction = `steps(${cycle})`;

	ctx.fillStyle = "rgba(0,0,0,0.2)";
	ctx.font = `${_font_size * dpr}px monospace`;
	for (let i = 0; i < rows; i++) {
		ctx.fillText(texts[i % cycle], 0, i * _font_size * dpr);
	}
}

onMount(() => {
	createTexts();
	draw();
	decrement();

	const observer = new ResizeObserver(draw);
	if (canvas.parentElement) {
		observer.observe(canvas.parentElement);
	}
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
    will-change: transform;
    animation: pattern-shift 1600ms steps(16) infinite;
  }

  @keyframes pattern-shift {
    to {
      transform: translateY(var(--cycle-shift, -128px));
    }
  }
</style>
