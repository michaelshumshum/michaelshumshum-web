import "./app.css";
import "./reset.css";
import { mount } from "svelte";
import App from "./App.svelte";

const appElement = document.getElementById("app");
if (!appElement) throw new Error("App element not found");

const app = mount(App, { target: appElement });

(document.querySelector("#app > div") as HTMLDivElement).style.opacity = "0";
(document.querySelector("#app > div") as HTMLDivElement).style.width = "0vw";

export default app;
