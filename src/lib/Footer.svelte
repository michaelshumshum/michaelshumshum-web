<script lang="ts">
  import svelteLogo from "../assets/svelte.svg";
</script>

<footer>
  <p>Created with</p>
  <img src="/svelte.svg" alt="svelte" />
  <img src="/typescript.svg" alt="typescript" />
  <img src="/vite.svg" alt="vite" />
</footer>

<style>
  footer {
    border-top: 2px solid black;
    background: white;
    gap: 1vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: 10vh;
    padding: 0 5vw;
    font-weight: 900;
    width: 100%;
  }

  footer * {
    user-select: none;
    pointer-events: none;
  }

  footer img {
    height: 40%;
  }
</style>
