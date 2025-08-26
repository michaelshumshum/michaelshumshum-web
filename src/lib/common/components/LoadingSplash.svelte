<script lang="ts">
import { fade } from "svelte/transition";
</script>

<div>
  <h1 transition:fade>Loading...</h1>
</div>

<style>
  div h1 {
    font-family: monospace;
  }
  div {
    z-index: 1000;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: white;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
