<script lang="ts">
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  interface Props {
    children: Snippet;
    details?: Snippet;
  }

  let { children, details }: Props = $props();
  let expanded = $state(false);

  function toggle() {
    expanded = !expanded;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") toggle();
  }
</script>

{#snippet inner()}
  <div class="timeline-header">
    {@render children()}
  </div>
  {#if details && expanded}
    <div class="timeline-details" transition:slide={{ duration: 250 }}>
      {@render details()}
    </div>
  {/if}
{/snippet}

{#if details}
  <button type="button" class="timeline-entry expandable" onclick={toggle} onkeydown={handleKeydown}>
    {@render inner()}
  </button>
{:else}
  <div class="timeline-entry">
    {@render inner()}
  </div>
{/if}

<style>
  .timeline-entry {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0;
    padding: 1em 0 1em 1em;
    margin-left: 1em;
    border-left: 2px solid black;
    position: relative;
  }

  .timeline-entry::before {
    content: "";
    display: block;
    background: black;
    border-radius: 100%;
    width: 6px;
    height: 6px;
    position: absolute;
    left: -4px;
    top: -4px;
  }

  button.timeline-entry {
    background: none;
    border: none;
    border-left: 2px solid black;
    text-align: left;
    font: inherit;
    color: inherit;
    width: 100%;
  }

  .timeline-entry.expandable {
    cursor: pointer;
    user-select: none;
    transition: padding-left 0.2s ease;
  }

  .timeline-entry.expandable:hover {
    padding-left: 1.5em;
  }

  .timeline-header {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .timeline-details {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    font-size: 0.875em;
    font-style: italic;
    overflow: hidden;
    padding-top: 1em;
  }
</style>
