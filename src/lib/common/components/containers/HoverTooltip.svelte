<script lang="ts">
  import { onMount } from "svelte";

  export let content: string;

  let visible = false;
</script>

<div
  role="tooltip"
  on:mouseenter={() => {
    visible = true;
  }}
  on:mouseleave={() => {
    visible = false;
  }}
>
  <slot></slot>
  <div class={visible ? "visible" : ""}>
    <p>{content}</p>
  </div>
</div>

<style>
  div {
    position: relative;
  }

  div > div {
    transform-origin: top left;
    position: absolute;
    left: 50%;
    transition: all 200ms ease;
    padding: 0.5em;
    background: white;
    border: 2px dotted black;
    text-align: center;
    cursor: default;
    top: 125%;
    transform: scale(100%) translateY(0) translateX(-50%);
  }

  div > div:not(.visible) {
    opacity: 0;
    transform: scale(0%) translateY(-200%) translateX(-50%);
  }
</style>
