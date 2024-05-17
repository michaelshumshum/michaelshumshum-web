<script lang="ts">
  import { onMount } from "svelte";

  let keyframesStyles = "<style>";

  let svg: SVGElement;
  onMount(() => {
    (svg.querySelectorAll(".svg-path") as NodeListOf<SVGPathElement>).forEach(
      (path) => {
        const length = path.getTotalLength().toFixed(2);

        // stupid hack from https://stackoverflow.com/a/53627545. fixes dot that appears sometimes
        path.style.strokeDasharray = `${length}px, ${parseFloat(length) + 1}px`;
        path.style.strokeDashoffset = `${path.classList.contains("flip") ? "" : "-"}${parseFloat(length) + 0.5}px`;

        path.style.animationName = `kf-${length.replaceAll(".", "")}`;
        path.style.animationTimingFunction = "ease";
        path.style.animationFillMode = "forwards";
        if (path.classList.contains("second-stage")) {
          path.style.animationDelay = "1150ms";
          path.style.animationDuration = "350ms";
        } else {
          path.style.animationDuration = "1s";
          path.style.animationDelay = "400ms";
        }
        keyframesStyles += `@keyframes kf-${length.replaceAll(".", "")}{from{ stroke-dashoffset:${path.classList.contains("flip") ? "" : "-"}${length}px;}to{stroke-dashoffset:0px;}}`;
      },
    );
    keyframesStyles += "</style>";
  });
</script>

<svelte:head>
  {@html keyframesStyles}
</svelte:head>

<svg
  bind:this={svg}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="-5 -5 1350 600"
>
  <path
    class="svg-path"
    d="M1049.71,158.72a40.31,40.31,0,0,0-80.61,0V413.33a40.31,40.31,0,1,1-80.61,0"
  />
  <path class="svg-path" d="M1333.24,363V199a40.31,40.31,0,1,0-80.61,0" />
  <path
    class="svg-path"
    d="M1172,361.53V199a40.31,40.31,0,1,1,80.61,0V445.85"
  />
  <path
    class="svg-path"
    d="M1009.4,445.85V279.78a40.31,40.31,0,1,1,80.61,0v61.49"
  />
  <path
    class="svg-path"
    d="M1130.31,158.72V350.18a40.3,40.3,0,1,1-80.6,0v-61.5"
  />
  <line
    class="svg-path second-stage"
    x1="1009.4"
    y1="158.72"
    x2="1009.4"
    y2="276.8"
  />
  <line
    class="svg-path second-stage flip"
    x1="1130.31"
    y1="327.78"
    x2="1130.31"
    y2="445.85"
  />
  <line
    class="svg-path second-stage"
    x1="1172.02"
    y1="158.72"
    x2="1172.02"
    y2="242.74"
  />
  <path
    class="svg-path"
    d="M649.88,278.13a40.31,40.31,0,0,1,80.61,0V445.85h96.63"
  />
  <path
    class="svg-path"
    d="M246.82999999999998,45.3a40.3,40.3 0 1,0 80.6,0a40.3,40.3 0 1,0 -80.6,0"
  />
  <path
    class="svg-path"
    d="M488.66,442.56V195.91a40.31,40.31,0,0,1,80.61,0V329.22"
  />
  <path
    class="svg-path"
    d="M408.05,193.13a40.31,40.31,0,0,0-80.61,0V362.42a40.31,40.31,0,1,0,80.61,0"
  />
  <path
    class="svg-path"
    d="M125.91 442.56 367.74 442.56 287.13 442.56 287.13 239.47"
  />
  <path class="svg-path" d="M166.22,402.8V199a40.31,40.31,0,1,0-80.61,0" />
  <path class="svg-path" d="M85.61,445.85V158.72a40.31,40.31,0,0,0-80.61,0" />
  <path class="svg-path" d="M246.83,402.8V199a40.31,40.31,0,1,0-80.61,0" />
  <path
    class="svg-path"
    d="M690.18,405.55a40.31,40.31,0,0,1-80.61,0V155.61h80.61"
  />
  <line class="svg-path" x1="523.15" y1="362.97" x2="695.72" y2="362.97" />
  <line
    class="svg-path second-stage"
    x1="488.66"
    y1="237.83"
    x2="569.27"
    y2="237.83"
  />
  <path
    class="svg-path"
    d="M448.35,442.56v-171a40.31,40.31,0,0,0-80.61,0v90.62"
  />
  <line
    class="svg-path second-stage flip"
    x1="367.74"
    y1="287.03"
    x2="367.74"
    y2="196.94"
  />
</svg>

<style>
  svg {
    max-width: 50%;
    height: max(50%, 10vh);
    position: relative;
    overflow: visible;
  }

  .svg-path {
    fill: none;
    stroke: black;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 20px;
  }
</style>
