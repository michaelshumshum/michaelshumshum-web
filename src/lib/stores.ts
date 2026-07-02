import { readable, writable } from "svelte/store";

export const windowSize = readable<{ width: number; height: number }>(
	{
		width: window.innerWidth,
		height: window.innerHeight,
	},
	(set) => {
		window.addEventListener("resize", () => {
			set({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		});
	},
);

export const loadingSemaphore = writable<number>(0);
