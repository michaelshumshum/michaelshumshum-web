<script lang="ts">
import { onMount } from "svelte";
import { windowSize } from "../stores";
import { elementVisible, randomString } from "../utils";

const _text_length = 50000;
const _font_size = 36;
let ctx: CanvasRenderingContext2D | null = null;

let wrapper: HTMLDivElement;
let canvas: HTMLCanvasElement;

let text = randomString(_text_length);
$: if (text && ctx) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = `${_font_size}px monospace`;
	ctx.fillStyle = "black";

	const necessaryLines = Math.ceil(canvas.height / _font_size);
	const lineLength = Math.ceil(_text_length / necessaryLines);

	for (let i = 0; i < necessaryLines; i++) {
		const line = text.slice(i * lineLength, (i + 1) * lineLength);
		ctx.fillText(line, 0, (i + 1) * _font_size);
	}
}

const resizeCanvas = () => {
	if (wrapper && canvas) {
		canvas.width = wrapper.clientWidth * window.devicePixelRatio;
		canvas.height = wrapper.clientHeight * window.devicePixelRatio;
		canvas.style.width = `${wrapper.clientWidth}px`;
		canvas.style.height = `${wrapper.clientHeight}px`;
	}
};

windowSize.subscribe(() => {
	resizeCanvas();
});

function animation() {
	if (wrapper && elementVisible(wrapper)) {
		text = randomString(_text_length);
	}
	setTimeout(() => {
		requestAnimationFrame(animation);
	}, 500);
}

onMount(() => {
	ctx = canvas.getContext("2d");
	resizeCanvas();
	animation();
});
</script>

<div bind:this={wrapper} class="matrix-canvas">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.matrix-canvas {
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
