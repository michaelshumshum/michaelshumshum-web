<script lang="ts">
import Pattern from "../canvas/Pattern.svelte";
import { scrollPosition } from "../stores";
import Logo from "../ui/Logo.svelte";

let currentScrollPosition = 0;

scrollPosition.subscribe((value) => {
	currentScrollPosition = value;
});
</script>

<div
  id="landing-header-hero"
  style={`height: ${Math.max(100 - (currentScrollPosition * 100) / window.innerHeight, 10).toFixed(1)}vh`}
>
  <Pattern baseText="michaelshumshum" />
  <Logo />
  <code
    style={`opacity:${currentScrollPosition < window.innerHeight * 0.5 ? 1 : 0}.0; transform: translateY(${
      currentScrollPosition < window.innerHeight * 0.5 ? 0 : 100
    }%); `}>building, skating, eating</code
  >
</div>

<style>
  code {
    font-family: monospace;
    text-align: center;
  }

  #landing-header-hero {
    z-index: 1000;
    background: white;
    position: fixed;
    top: 0;
    border-bottom: 2px solid black;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 5vw;
    overflow: hidden;
  }

  #landing-header-hero code {
    position: absolute;
    transition: all 250ms ease;
    bottom: 25%;
    font-size: 1.5em;
  }
</style>
