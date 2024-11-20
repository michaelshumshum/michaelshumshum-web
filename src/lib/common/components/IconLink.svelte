<script lang="ts">
  export let src: string;
  export let href: string;
</script>

<a target={href.includes("mailto:") ? "" : "_blank"} {href}>
  <img {src} alt={src} draggable={false} />
</a>

<style>
  img {
    aspect-ratio: 1/1;
    display: inline-block;
    height: 100%;
  }
</style>
