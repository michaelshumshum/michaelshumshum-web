<script lang="ts">
  import { onMount } from "svelte";

  if (
    import.meta.env.PROD &&
    !window.location.href.includes("michael.shumshum.dev")
  ) {
    window.location.replace("https://michael.shumshum.dev");
  }

  let socialBox: HTMLDivElement;
  let contactBox: HTMLDivElement;

  import Footer from "./lib/Footer.svelte";
  import InlineIcon from "./lib/InlineIcon.svelte";
  import Line from "./lib/Line.svelte";
  import Logo from "./lib/Logo.svelte";

  import { elementVisible } from "./lib/utils";

  let scrollPosition: number = window.scrollY;
  window.addEventListener("scroll", () => {
    scrollPosition = window.scrollY;

    if (elementVisible(contactBox)) {
      socialBox.style.transform = "scaleY(1)";
    } else {
      socialBox.style.transform = "scaleY(0)";
    }
  });

  onMount(() => {
    setTimeout(() => {
      if (scrollPosition == 0) {
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
    style={`height: ${Math.max(100 - (scrollPosition * 100) / window.innerHeight, 10).toFixed(1)}vh`}
  >
    <Logo />
    <code
      bind:this={quoteBlock}
      style={`opacity:${scrollPosition < window.innerHeight * 0.5 ? 1 : 0}.0; transform: translateY(${
        scrollPosition < window.innerHeight * 0.5 ? 0 : 100
      }%); `}>building, compiling, squashing</code
    >
  </div>
  <div id="main-content">
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
  h1 {
    font-size: 2em;
    font-weight: 900;
  }
  code {
    font-family: monospace;
    margin: 0 5vw;
    text-align: center;
  }
  #landing-header-hero {
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

  #contact-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 2vh;
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

  #contact-box a:hover {
    transform: skew(-10deg);
  }

  #social-box {
    transform-origin: top;
    transition: all 500ms ease;
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1vh 0 1vh 1em;
    border-left: 2px solid black;
  }
  #main-content {
    padding: 15vh 10vw;
    margin-top: 100vh;
    min-height: 90vh;
  }
</style>
