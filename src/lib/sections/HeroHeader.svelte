<script lang="ts">
import { onMount } from "svelte";
import Pattern from "../canvas/Pattern.svelte";
import Logo from "../ui/Logo.svelte";

let heroEl: HTMLDivElement;
let canvasAnchorEl: HTMLDivElement;
let logoScaleEl: HTMLDivElement;
let codeEl: HTMLElement;

// The shrink effect is faked with transforms only (translate/scale), never
// `height`: layout properties can't run on the compositor even inside a CSS
// scroll-driven animation, and relayouting the hero + SVG logo every scrolled
// frame is what made mobile stutter. The hero stays a static 100vh box that
// slides up; the canvas counter-slides to appear pinned; the logo scales down.
//
// Modern browsers do all of this in CSS via scroll-timeline (see the style
// block below). Only browsers lacking that support fall back to this
// rAF-throttled scroll listener, which applies the same transforms.
onMount(() => {
	if (
		typeof CSS !== "undefined" &&
		CSS.supports("animation-timeline: scroll()")
	) {
		return;
	}

	let ticking = false;

	function update() {
		ticking = false;
		const innerHeight = window.innerHeight;
		const y = Math.min(window.scrollY, innerHeight * 0.9);
		const progress = y / (innerHeight * 0.9);

		heroEl.style.transform = `translateY(${-y}px)`;
		canvasAnchorEl.style.transform = `translateY(${y}px)`;
		logoScaleEl.style.transform = `translateY(${y / 2}px) scale(${1 - 0.8 * progress})`;

		const visible = window.scrollY < innerHeight * 0.5;
		codeEl.style.opacity = visible ? "1" : "0";
		codeEl.style.transform = `translateY(${visible ? 0 : 100}%)`;
	}

	function onScroll() {
		if (!ticking) {
			ticking = true;
			requestAnimationFrame(update);
		}
	}

	update();
	window.addEventListener("scroll", onScroll, { passive: true });

	return () => window.removeEventListener("scroll", onScroll);
});
</script>

<div id="landing-header-hero" bind:this={heroEl}>
  <div class="canvas-anchor" bind:this={canvasAnchorEl}>
    <Pattern baseText="michaelshumshum" />
  </div>
  <div class="logo-scale" bind:this={logoScaleEl}>
    <Logo />
  </div>
  <code bind:this={codeEl}>building, skating, eating</code>
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
    height: 100vh;
    overflow: hidden;
    will-change: transform;
  }

  .canvas-anchor,
  .logo-scale {
    position: absolute;
    inset: 0;
    will-change: transform;
  }

  .logo-scale {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 5vw;
  }

  #landing-header-hero code {
    position: absolute;
    left: 0;
    right: 0;
    transition: all 250ms ease;
    bottom: 25%;
    font-size: 1.5em;
    opacity: 1;
    transform: translateY(0%);
  }

  /* Compositor-only equivalent of the JS scroll handler above: every animated
     property is a transform or opacity, so the whole effect runs off the main
     thread with zero layout or paint per frame. */
  @supports (animation-timeline: scroll()) {
    #landing-header-hero {
      animation: hero-up linear both;
      animation-timeline: scroll(root block);
      animation-range: 0 90vh;
    }

    .canvas-anchor {
      animation: canvas-pin linear both;
      animation-timeline: scroll(root block);
      animation-range: 0 90vh;
    }

    .logo-scale {
      animation: logo-shrink linear both;
      animation-timeline: scroll(root block);
      animation-range: 0 90vh;
    }

    #landing-header-hero code {
      transition: none;
      animation: fade-code linear both;
      animation-timeline: scroll(root block);
      animation-range: 0 50vh;
    }
  }

  /* Slides the hero up so its bottom edge lands at 10vh, matching the old
     100vh -> 10vh height shrink 1:1 with scroll. */
  @keyframes hero-up {
    to {
      transform: translateY(-90vh);
    }
  }

  /* Counter-translation keeps the canvas visually pinned to the viewport
     while its parent slides up. */
  @keyframes canvas-pin {
    to {
      transform: translateY(90vh);
    }
  }

  /* Re-centers the logo within the visible band and shrinks it to the size
     it had when the hero bottomed out at 10vh (50vh -> 10vh = 0.2). */
  @keyframes logo-shrink {
    to {
      transform: translateY(45vh) scale(0.2);
    }
  }

  @keyframes fade-code {
    to {
      opacity: 0;
      transform: translateY(100%);
    }
  }
</style>
