<script lang="ts">
if (
	import.meta.env.PROD &&
	!window.location.href.includes("michael.shumshum.dev")
) {
	window.location.replace("https://michael.shumshum.dev");
}


import { onMount } from "svelte";
import { get } from "svelte/store";
import HeatmapCanvas from "./lib/canvas/HeatmapCanvas.svelte";
import MatrixCanvas from "./lib/canvas/MatrixCanvas.svelte";
import BackdropWrapper from "./lib/sections/BackdropWrapper.svelte";
import Footer from "./lib/sections/Footer.svelte";
import HeroHeader from "./lib/sections/HeroHeader.svelte";
import { loadingSemaphore, scrollPosition } from "./lib/stores";
import DownloadLink from "./lib/ui/DownloadLink.svelte";
import HoverTooltip from "./lib/ui/HoverTooltip.svelte";
import IconLink from "./lib/ui/IconLink.svelte";
import Line from "./lib/ui/Line.svelte";
import LoadingSplash from "./lib/ui/LoadingSplash.svelte";
import TimelineEntry from "./lib/ui/TimelineEntry.svelte";



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
  <HeroHeader />
  <div id="main-content">
    <BackdropWrapper>
      {#snippet background()}<MatrixCanvas />{/snippet}
      <div id="experience-box">
        <h2>Experience</h2>
        <Line />
        <TimelineEntry>
          <h4>Software Engineer – Bowtie Life Insurance Hong Kong</h4>
          <h5>January 2026 - PRESENT</h5>
          {#snippet details()}
            <p>Full-time at a digital insurance startup in HK. Building B2B products and shipping LLM tooling to improve how the team and customers interact with the platform.</p>
          {/snippet}
        </TimelineEntry>
        <TimelineEntry>
          <h4>Software Engineer Intern – Bowtie Life Insurance Hong Kong</h4>
          <h5>May 2025 - August 2025</h5>
          {#snippet details()}
            <p>Second internship, went deeper into the full stack. Built insurance automation features in Django and React, then led a big refactor across the codebase.</p>
          {/snippet}
        </TimelineEntry>
        <TimelineEntry>
          <h4>Software Engineer Intern – Bowtie Life Insurance Hong Kong</h4>
          <h5>June 2024 - August 2024</h5>
          {#snippet details()}
            <p>First Bowtie stint. Mostly backend Django — cleaned up the API layer, reorganized the database, and fixed a lot of bugs.</p>
          {/snippet}
        </TimelineEntry>
        <TimelineEntry>
          <h4>IT Technical Intern – iCHEF Hong Kong</h4>
          <h5>June 2023 - August 2023</h5>
          {#snippet details()}
            <p>On-site IT work across HK — setting up enterprise networks and iPad POS systems at small businesses and restaurants. Also kicked off a website rebuild in React and Django.</p>
          {/snippet}
        </TimelineEntry>
        <TimelineEntry>
          <h4>Web Development Consultant – Dotwise Hong Kong</h4>
          <h5>June 2022 - August 2022</h5>
          {#snippet details()}
            <p>Built a landing site for a local marketing consultancy from scratch. Django backend, vanilla JS and CSS on the front.</p>
          {/snippet}
        </TimelineEntry>
      </div>
      <br />
      <div id="education-box">
        <h2>Education</h2>
        <Line />
        <TimelineEntry>
          <h4>
            Bachelor of Science in Computer Science – Arizona State University
          </h4>
          <h5>August 2022 - December 2025</h5>
          {#snippet details()}
            <p>3.96 GPA, Summa Cum Laude.</p>
          {/snippet}
        </TimelineEntry>
        <TimelineEntry>
          <h4>High School Diploma – Hong Kong International School</h4>
          <h5>August 2019 - May 2022</h5>
          {#snippet details()}
            <p>3.63 GPA, High Honors, 5 AP credits.</p>
          {/snippet}
        </TimelineEntry>
      </div>
    </BackdropWrapper>
    <BackdropWrapper>
      {#snippet background()}<HeatmapCanvas />{/snippet}
      <div id="personal-section">
        <div id="about-me">
          <h1>About Me</h1>
          <Line />
          <p>software engineering by day, skateboarding religiously, taking food way too seriously</p>
          <DownloadLink
            href="https://files.shumshum.dev/resume_20260528.pdf"
            label="my resume"
          />
        </div>
        <div id="contact-box">
          <h1>Find Me</h1>
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
    </BackdropWrapper>
  </div>
  <Footer />
</main>

<style>
  @import "app.css";

  #experience-box,
  #education-box {
    display: flex;
    flex-direction: column;
    gap: 1em;
    align-items: start;
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
    align-items: start;
    gap: 1em;
    margin-top: 1em;
  }

  .social-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: space-between;
    width: 100%;
    height: 3em;
    padding-right: 4vw;
  }

  #main-content {
    padding: 15vh 10vw;
    margin-top: 100vh;
    min-height: 90vh;
  }

    p {
        font-size: 1.1em;
        line-height: 1.5em;
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
