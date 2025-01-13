<script lang="ts">
  if (
    import.meta.env.PROD &&
    !window.location.href.includes("michael.shumshum.dev")
  ) {
    window.location.replace("https://michael.shumshum.dev");
  }

  import { onMount } from "svelte";
  import Footer from "./lib/Footer.svelte";
  import InlineIcon from "./lib/common/components/InlineIcon.svelte";
  import Line from "./lib/common/components/Line.svelte";
  import Logo from "./lib/Logo.svelte";
  import smoothscroll from "smoothscroll-polyfill"; // scroll-behavior: smooth polyfill for unsupported browsers

  import { get } from "svelte/store";
  import { loadingSemaphore, scrollPosition } from "./lib/common/stores";
  import PsuedoHacker from "./lib/PsuedoHacker.svelte";
  import Pattern from "./lib/Pattern.svelte";
  import IconLink from "./lib/common/components/IconLink.svelte";
  import HoverTooltip from "./lib/common/components/containers/HoverTooltip.svelte";
  import LoadingSplash from "./lib/common/components/LoadingSplash.svelte";

  smoothscroll.polyfill();

  let currentScrollPosition = 0;

  scrollPosition.subscribe((value) => {
    currentScrollPosition = value;
  });

  let ready = false;

  loadingSemaphore.subscribe((value) => {
    ready = value === 0;
  });

  onMount(() => {
    setTimeout(() => {
      if (get(scrollPosition) === 0) {
        window.scrollBy({
          top: window.innerHeight,
          behavior: "smooth",
        });
      }
    }, 3000);
  });
</script>

<main>
  {#if !ready}
    <LoadingSplash />
  {/if}
  <div
    id="landing-header-hero"
    style={`height: ${Math.max(100 - (currentScrollPosition * 100) / window.innerHeight, 10).toFixed(1)}vh`}
  >
    <Pattern baseText="michaelshumshum" />
    <Logo />
    <code
      style={`opacity:${currentScrollPosition < window.innerHeight * 0.5 ? 1 : 0}.0; transform: translateY(${
        currentScrollPosition < window.innerHeight * 0.5 ? 0 : 100
      }%); `}>building, compiling, squashing</code
    >
  </div>
  <div id="main-content">
    <PsuedoHacker>
      <div id="experience-box">
        <h2>Experience</h2>
        <Line />
        <div class="experience-entry">
          <h4>Software Engineer Intern – Bowtie Life Insurance Hong Kong</h4>
          <h5>June 2024 - August 2024</h5>
        </div>
        <div class="experience-entry">
          <h4>IT Technical Intern – iCHEF Hong Kong</h4>
          <h5>June 2023 - August 2023</h5>
        </div>
      </div>
      <br />
      <div id="education-box">
        <h2>Education</h2>
        <Line />
        <div class="education-entry">
          <h4>
            Bachelor of Science in Computer Science – Arizona State University
          </h4>
          <h5>August 2022 - December 2025 (PRESENT)</h5>
        </div>
        <div class="education-entry">
          <h4>High School Diploma – Hong Kong International School</h4>
          <h5>August 2019 - May 2022</h5>
        </div>
      </div></PsuedoHacker
    >
    <div id="personal-section">
      <div id="about-me">
        <h1>About Me</h1>
        <Line />
        <p>skateboarding, computer science, eating good food</p>
      </div>
      <div id="contact-box">
        <h1>Contact Me</h1>
        <Line />
        <div class="social-links">
          <!-- this email icon looks terrible imo and doesn't fit aesthetically-->
          <HoverTooltip content="michael@shumshum.dev">
            <IconLink
              href="mailto:michael@shumshum.dev"
              src="social-icons/email.svg"
            />
          </HoverTooltip>
          <HoverTooltip content="GitHub">
            <IconLink
              href="https://www.github.com/michaelshumshum"
              src="social-icons/github.svg"
            />
          </HoverTooltip>
          <HoverTooltip content="LinkedIn">
            <IconLink
              href="https://www.linkedin.com/in/michaelshumshum"
              src="social-icons/linkedin.svg"
            />
          </HoverTooltip>
          <HoverTooltip content="Instagram">
            <IconLink
              href="https://www.instagram.com/michael.shumshum"
              src="social-icons/instagram.svg"
            />
          </HoverTooltip>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</main>

<style>
  @import "app.css";

  code {
    font-family: monospace;
    text-align: center;
  }
  #landing-header-hero {
    z-index: 1000;
    background: white;
    position: relative;
    top: 0;
    background: white;
    border-bottom: 2px solid black;
    position: fixed;
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

  #experience-box,
  #education-box {
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: start;
  }

  .experience-entry,
  .education-entry {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1em;
    padding: 1em 0 1em 1em;
    margin-left: 1em;
    border-left: 2px solid black;
    position: relative;
  }

  .experience-entry::before,
  .education-entry::before {
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

  #personal-section {
    display: grid;
    grid-template-columns: 4fr 3fr;
    grid-template-rows: 1fr;
    gap: 5em;
  }

  #personal-section > div {
    display: flex;
    flex-direction: column;
    gap: 1em;
    margin-top: 1em;
  }

  .social-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 3em;
    padding-right: 4vw;
  }

  #main-content {
    padding: 15vh 10vw;
    margin-top: 100vh;
    min-height: 90vh;
  }

  @media (max-width: 800px) {
    h1 {
      font-size: 1.5em;
    }
    h2 {
      font-size: 1.2em;
    }
    h4 {
      font-size: 1em;
    }
    h5 {
      font-size: 0.8em;
    }
    #main-content {
      padding: 10vh 5vw;
    }
    #personal-section {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
    }
  }
</style>
