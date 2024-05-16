<script lang="ts">
  export let thickness: number = 2;
  export let color: Color = "#000000";
</script>

<div class="line" style={`height: ${thickness}px; background: ${color}`}></div>

<style>
  div {
    width: 100%;
  }
</style>
