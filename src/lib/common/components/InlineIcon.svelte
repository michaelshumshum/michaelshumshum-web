<script lang="ts">
  export let src: string;
</script>

<span><img {src} alt={src} draggable={false} /></span>

<style>
  img {
    aspect-ratio: 1/1;
    display: inline-block;
    height: 1em;
  }

  span {
    aspect-ratio: 1/1;
    font-size: inherit;
    display: inline-block;
    margin: 0 5px;
    vertical-align: middle;
  }
</style>
