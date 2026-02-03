<script lang="ts">
let { src, href }: { src: string; href: string } = $props();
</script>

<a target={href.includes("mailto:") ? "" : "_blank"} {href}>
  <!-- set explicit width cuz safari and mobile browsers are dumb -->
  <img {src} alt={src} draggable={false} width="48px" height="48px" />
</a>

<style>
  img {
    aspect-ratio: 1/1;
    display: block;
    height: 100%;
  }
</style>
