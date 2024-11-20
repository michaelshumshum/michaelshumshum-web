<script lang="ts">
  import { onMount } from "svelte";
  import { windowSize } from "./common/stores";
  import { get } from "svelte/store";

  const _font_size = 8;
  const _text_length = 500000;

  const text = "michaelshumshum ".repeat(_text_length / 15);
  const textures: string[] = [];
  let img: HTMLImageElement;
  let currentTexture = 0;

  function generateTextures() {
    let text = "michaelshumshum ".repeat(_text_length / 15);
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) {
      console.error("Could not get 2d context of tempCanvas");
      return;
    }
    tempCanvas.width = get(windowSize).width;
    tempCanvas.height = get(windowSize).height;

    tempCtx.font = `${_font_size}px monospace`;
    tempCtx.fillStyle = "rgba(0,0,0,0.2)";

    for (let _ = 0; _ < 16; _++) {
      text = text.slice(1) + text[0];
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

      const necessaryLines = Math.ceil(tempCanvas.height / _font_size);
      const lineLength = Math.ceil(_text_length / necessaryLines);

      for (let i = 0; i < necessaryLines; i++) {
        const line = text.slice(i * lineLength, (i + 1) * lineLength);
        tempCtx.fillText(line, 0, (i + 1) * _font_size);
      }

      textures.push(tempCanvas.toDataURL("image/png", 0.2));
    }
  }

  function draw() {
    img.src = textures[currentTexture];
  }

  onMount(() => {
    generateTextures();
    setInterval(() => {
      currentTexture = (currentTexture + 1) % textures.length;
      draw();
    }, 50);
  });
</script>

<img alt="" src="" bind:this={img} />

<style>
  img {
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
