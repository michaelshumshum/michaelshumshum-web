<script lang="ts">
import { onMount } from "svelte";
import { elementVisible, randomString } from "../utils";

const _font_size = 36;
let ctx: CanvasRenderingContext2D | null = null;

let wrapper: HTMLDivElement;
let canvas: HTMLCanvasElement;

let charsPerLine = 0;

let text = "";
$: if (text && ctx && charsPerLine > 0) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = `${_font_size}px monospace`;
	ctx.fillStyle = "black";

	const necessaryLines = Math.ceil(canvas.height / _font_size);

	for (let i = 0; i < necessaryLines; i++) {
		const line = text.slice(i * charsPerLine, (i + 1) * charsPerLine);
		ctx.fillText(line, 0, (i + 1) * _font_size);
	}
}

const resizeCanvas = () => {
	if (wrapper && canvas && ctx) {
		canvas.width = wrapper.clientWidth * window.devicePixelRatio;
		canvas.height = wrapper.clientHeight * window.devicePixelRatio;
		canvas.style.width = `${wrapper.clientWidth}px`;
		canvas.style.height = `${wrapper.clientHeight}px`;
		ctx.font = `${_font_size}px monospace`;
		charsPerLine = Math.ceil(canvas.width / ctx.measureText("M").width);
	}
};

// Regenerating the text redraws and re-uploads the full section-sized
// canvas texture; doing that mid-scroll causes visible hitches on mobile,
// so hold the current frame until scrolling settles.
let lastScrollTs = 0;

function animation() {
	if (
		wrapper &&
		elementVisible(wrapper) &&
		charsPerLine > 0 &&
		Date.now() - lastScrollTs > 150
	) {
		const necessaryLines = Math.ceil(canvas.height / _font_size * 1.1);
		text = randomString(charsPerLine * necessaryLines);
	}
	setTimeout(() => {
		requestAnimationFrame(animation);
	}, 500);
}

onMount(() => {
	ctx = canvas.getContext("2d");
	resizeCanvas();
	animation();
	const observer = new ResizeObserver(() => resizeCanvas());
	observer.observe(wrapper);
	const onScroll = () => {
		lastScrollTs = Date.now();
	};
	window.addEventListener("scroll", onScroll, { passive: true });
	return () => {
		observer.disconnect();
		window.removeEventListener("scroll", onScroll);
	};
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
