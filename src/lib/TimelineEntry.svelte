<div class="timeline-entry" {...$$restProps}>
  <slot />
</div>

<style>
  .timeline-entry {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1em;
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
</style>
