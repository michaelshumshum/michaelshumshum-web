<script lang="ts">
  /**
   * @param [thickness=2] Thickness of line in pixels
   */
  export const thickness: number = 2;

  /**
   * @param [color="#000000"] Color of line
   */
  export const color: Color = "#000000";
</script>

<div class="line" style={`height:${thickness}px; background:${color}`}></div>

<style>
  div {
    width: 100%;
  }
</style>
