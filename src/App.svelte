<script lang="ts">
  import Footer from "./lib/Footer.svelte";
  import Line from "./lib/Line.svelte";
  import Logo from "./lib/Logo.svelte";

  let scrollPosition: number = window.scrollY;
  window.addEventListener("scroll", () => {
    scrollPosition = window.scrollY;
  });
</script>

<main>
  <div
    id="landing-header-hero"
    style={`height: ${Math.max(100 - (scrollPosition * 100) / window.innerHeight, 10).toFixed(1)}vh`}
  >
    <Logo />
  </div>
  <div id="main-content">
    <div id="contact-box">
      <h1>Contact Me</h1>
      <Line thickness={2} color="#000000" />
      <a href="mailto:michael@shumshum.dev">michael@shumshum.dev</a>
    </div>
  </div>
  <Footer />
</main>

<style>
  h1 {
    font-size: 3em;
    font-weight: 900;
  }
  #landing-header-hero {
    top: 0;
    background: white;
    border-bottom: 2px solid black;
    position: fixed;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
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
  }

  #main-content {
    padding: 15vh 10vw;
    margin-top: 100vh;
    min-height: 90vh;
  }
</style>
