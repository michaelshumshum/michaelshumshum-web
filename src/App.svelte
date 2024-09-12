<script lang="ts">
  if (
    import.meta.env.PROD &&
    !window.location.href.includes("michael.shumshum.dev")
  ) {
    window.location.replace("https://michael.shumshum.dev");
  }

  let socialBox: HTMLDivElement;
  let contactBox: HTMLDivElement;

  import { onMount } from "svelte";
  import Footer from "./lib/Footer.svelte";
  import InlineIcon from "./lib/common/components/InlineIcon.svelte";
  import Line from "./lib/common/components/Line.svelte";
  import Logo from "./lib/Logo.svelte";
  import smoothscroll from "smoothscroll-polyfill"; // scroll-behavior: smooth polyfill for unsupported browsers

  import { get } from "svelte/store";
  import { scrollPosition } from "./lib/common/stores";
  import PsuedoHacker from "./lib/PsuedoHacker.svelte";

  smoothscroll.polyfill();

  let currentScrollPosition = 0;

  scrollPosition.subscribe((value) => {
    currentScrollPosition = value;
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
  <div
    id="landing-header-hero"
    style={`height: ${Math.max(100 - (currentScrollPosition * 100) / window.innerHeight, 10).toFixed(1)}vh`}
  >
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
          <h4>
            Software Engineer Intern – Bowtie Life Insurance Insurance Hong Kong
          </h4>
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
          <h5>August 2020 - May 2022</h5>
        </div>
      </div></PsuedoHacker
    >
    <div bind:this={contactBox} id="contact-box">
      <h1>Contact Me</h1>
      <Line thickness={2} color="#000000" />
      <a href="mailto:michael@shumshum.dev">michael@shumshum.dev</a>
      <div bind:this={socialBox} id="social-box">
        <a target="_blank" href="https://github.com/michaelshumshum"
          ><InlineIcon src="social-icons/github.svg" />GitHub</a
        >
        <a target="_blank" href="https://www.linkedin.com/in/michaelshumshum/"
          ><InlineIcon src="social-icons/linkedin.svg" />LinkedIn</a
        >
        <a target="_blank" href="https://www.instagram.com/michael.shumshum"
          ><InlineIcon src="social-icons/instagram.svg" />Instagram</a
        >
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

  #contact-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 1em;
    align-items: flex-start;
    height: 100%;
  }

  #contact-box a {
    text-decoration: none;
    border-bottom: 2px solid black;
    color: black;
    font-size: 1.2em;
    padding: 0.2vh 1vw 0.2vh 0.5vw;
    transition: all 200ms ease;
    height: 100%;
  }

  #social-box {
    border-radius: 2em;
    transform-origin: top;
    transition: all 500ms ease;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    gap: 1em;
    padding: 2em;
    border: 2px solid black;
    width: 100%;
  }

  #social-box > a {
    width: 100%;
  }

  #main-content {
    padding: 15vh 10vw;
    margin-top: 100vh;
    min-height: 90vh;
  }

  @media (max-width: 800px) {
    #main-content {
      padding: 10vh 5vw;
    }
    #social-box {
      flex-direction: column;
    }
  }
</style>
