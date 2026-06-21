<script lang="ts">
import type { Color } from "../types/Color";

/**
 * @param [thickness=2] Thickness of line in pixels
 *
 * @param [color="#000000"] Color of line
 */
interface LineProps {
	thickness?: number;
	color?: Color;
}

let { thickness = 2, color = "#000000" }: LineProps = $props();
</script>

<div class="line" style={`height:${thickness}px; background:${color}`}></div>

<style>
  div {
    width: 100%;
  }
</style>
