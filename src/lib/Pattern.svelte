<script lang="ts">
  import { onMount } from "svelte";
  import { windowSize } from "./common/stores";
  import { get } from "svelte/store";
  import { incrementLoadingSemaphore } from "./common/utils";

  const decrement = incrementLoadingSemaphore();

  const _font_size = 8;
  const _text_length = 500000;

  export let baseText: string;

  const textures: string[] = [];
  let img: HTMLImageElement;
  let currentTexture = 0;

  function loadTexturesFromCache() {
    const currentWindowSize = get(windowSize);
    const lastWindowSize = {
      width: 0,
      height: 0,
    };
    const _ = window.localStorage.getItem("last_window_size");
    if (!_) {
      return false;
    }
    lastWindowSize.width = Number.parseInt(_.split(",")[0], 16);
    lastWindowSize.height = Number.parseInt(_.split(",")[1], 16);
    let localStorageItem = window.localStorage.getItem(`pattern_${baseText}_0`);

    if (
      currentWindowSize.width !== lastWindowSize.width ||
      currentWindowSize.height !== lastWindowSize.height
    ) {
      return false;
    }

    if (localStorageItem) {
      textures.push(localStorageItem);

      let i = 1;
      while (true) {
        localStorageItem = window.localStorage.getItem(
          `pattern_${baseText}_${i}`,
        );
        if (localStorageItem) {
          textures.push(localStorageItem);
          i++;
        } else {
          break;
        }
      }

      return true;
    }
    return false; // no textures found in cache
  }

  async function generateTextures() {
    // caching the textures to reduce loading on subsequent visits.
    if (loadTexturesFromCache()) {
      return;
    }
    let text = `${baseText} `.repeat(_text_length / 15);
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

    for (let _ = 0; _ < baseText.length + 1; _++) {
      text = text.slice(1) + text[0];
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

      const necessaryLines = Math.ceil(tempCanvas.height / _font_size);
      const lineLength = Math.ceil(_text_length / necessaryLines);

      for (let i = 0; i < necessaryLines; i++) {
        const line = text.slice(i * lineLength, (i + 1) * lineLength);
        tempCtx.fillText(line, 0, (i + 1) * _font_size);
      }
      textures.push(tempCanvas.toDataURL("image/webp", 0.2));
    }
    for (let i = 0; i < textures.length; i++) {
      window.localStorage.setItem(`pattern_${baseText}_${i}`, textures[i]);
    }

    // store the current window size
    window.localStorage.setItem(
      "last_window_size",
      `${get(windowSize).width.toString(16)},${get(windowSize).height.toString(16)}`,
    );
  }

  function animation() {
    // TODO: when resizing, the image is stretched or shrank, which results in a unintended pattern look
    // regenerating the textures on windowSize change is a possible solution, but it results in a lag spike as a result of the heavy graphics computation
    currentTexture = (currentTexture + 1) % textures.length;
    img.src = textures[currentTexture];

    setTimeout(() => {
      requestAnimationFrame(animation);
    }, 75);
  }

  onMount(() => {
    generateTextures().then(decrement);
    animation();
  });
</script>

<img alt="" src="" bind:this={img} draggable="false" />

<style>
  img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: 50% 50%;
  }
</style>
