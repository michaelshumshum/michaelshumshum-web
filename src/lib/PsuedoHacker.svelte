<script lang="ts">
import { onMount } from "svelte";
import { scrollPosition, windowSize } from "./common/stores";
import { elementVisible, randomString } from "./common/utils";

/**
 * How much "hacker text" to generate
 */
const _text_length = 50000;
const _font_size = 36;
let ctx: CanvasRenderingContext2D | null = null;

let element: HTMLDivElement;
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
	if (element && canvas) {
		canvas.width = element.clientWidth * window.devicePixelRatio;
		canvas.height = element.clientHeight * window.devicePixelRatio;
		canvas.style.width = `${element.clientWidth}px`;
		canvas.style.height = `${element.clientHeight}px`;
	}
};

windowSize.subscribe(() => {
	resizeCanvas();
});

function animation() {
	if (element && elementVisible(element)) {
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

<div bind:this={element} class="pseudo-hacker">
  <canvas bind:this={canvas}></canvas>
  <div><slot /></div>
</div>

<style>
  .pseudo-hacker {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3vh;
    margin: 5vh 0;
  }
  .pseudo-hacker > div {
    padding: 5vh;
    background: white;
    height: 100%;
    width: 100%;
    z-index: 99;
  }
  canvas {
    top: 0;
    left: 0;
    position: absolute;
  }

  @media (max-width: 800px) {
    .pseudo-hacker {
      padding: 5vw;
    }

    .pseudo-hacker > div {
      padding: 7vw;
    }
  }
</style>
