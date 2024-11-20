import "./app.css";
import "./reset.css";
import App from "./App.svelte";

const app = new App({
	target: document.getElementById("app")!,
});

(document.querySelector("#app > div") as HTMLDivElement).style.opacity = "0";
(document.querySelector("#app > div") as HTMLDivElement).style.width = "0vw";

export default app;
