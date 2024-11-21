<script lang="ts">
  import { onMount } from "svelte";

  export let content: string;

  let container: HTMLDivElement;
  let dialog: HTMLDivElement;

  let visible: boolean;

  onMount(() => {
    visible = false;
    const width = dialog.offsetWidth;
    dialog.style.left = `${-width / 2 + container.offsetWidth / 2}px`;
  });
</script>

<div
  role="tooltip"
  bind:this={container}
  on:mouseenter={() => {
    visible = true;
  }}
  on:mouseleave={() => {
    visible = false;
  }}
>
  <slot></slot>
  <div bind:this={dialog} class={visible ? "visible" : ""}>
    <p>{content}</p>
  </div>
</div>

<style>
  div {
    position: relative;
  }

  div > div {
    position: absolute;
    transition: all 200ms ease;
    padding: 0.5em;
    background: white;
    border: 2px solid black;
    text-align: center;
    cursor: default;
    border-radius: 0.5em;
    top: 125%;
    transform: scale(100%) translateY(0);
  }

  div > div:not(.visible) {
    opacity: 0;
    transform: scale(0%) translateY(-200%);
  }
</style>
