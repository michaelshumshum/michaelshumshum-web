<script lang="ts">
  import { onMount } from "svelte";

  let footerLink: HTMLAnchorElement;
  let footerLinkShadow: HTMLHeadingElement;

  const enter = () => {
    (
      footerLink.querySelectorAll(":not(h2)") as NodeListOf<HTMLElement>
    ).forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateX(100%)";
    });
    footerLinkShadow.style.opacity = "1";
    footerLinkShadow.style.transform = "translateY(0%)";
  };

  const leave = () => {
    (
      footerLink.querySelectorAll(":not(h2)") as NodeListOf<HTMLElement>
    ).forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "translateX(0%)";
    });
    footerLinkShadow.style.opacity = "0";
    footerLinkShadow.style.transform = "translateY(100%)";
  };

  onMount(() => {
    leave();
  });
</script>

<footer>
  <a
    bind:this={footerLink}
    on:mouseenter={enter}
    on:mouseleave={leave}
    target="_blank"
    href="https://github.com/michaelshumshum/michaelshumshum-web"
  >
    <p>Created with</p>
    <img draggable="false" src="/svelte.svg" alt="svelte" />
    <img draggable="false" src="/typescript.svg" alt="typescript" />
    <img draggable="false" src="/vite.svg" alt="vite" />
    <h2 bind:this={footerLinkShadow}>View Source</h2>
  </a>
</footer>

<style>
  footer {
    border-top: 2px solid black;
    background: white;
    height: 10vh;
    padding: 0 10vw;
    font-weight: 900;
    width: 100%;
  }

  footer a {
    display: block;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: inherit;
    gap: 1vw;
    text-decoration: none;
    color: black;
  }

  footer a *:not(h2) {
    transition: all 200ms ease;
  }

  footer a h2 {
    transition: all 200ms ease;
    position: absolute;
    font-size: 1.5em;
    border-bottom: 2px solid black;
  }

  footer a * {
    user-select: none;
  }

  footer a img {
    height: 40%;
  }

  @media (max-width: 800px) {
    footer {
      padding: 0 5vw;
    }
  }
</style>
