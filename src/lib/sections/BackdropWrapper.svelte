<script lang="ts">
import type { Snippet } from "svelte";

let { background, children }: { background?: Snippet; children?: Snippet } = $props();
</script>

<div class="backdrop-wrapper">
  {#if background}
    {@render background()}
  {/if}
  <div>{@render children?.()}</div>
</div>

<style>
  .backdrop-wrapper {
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3vh;
    margin: 5vh 0;
  }
  .backdrop-wrapper > div {
    padding: 5vh;
    background: white;
    height: 100%;
    width: 100%;
    z-index: 99;
  }

  @media (max-width: 800px) {
    .backdrop-wrapper {
      padding: 5vw;
    }

    .backdrop-wrapper > div {
      padding: 7vw;
    }
  }
</style>
