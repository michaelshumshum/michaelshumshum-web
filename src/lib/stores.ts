import { readable, writable } from "svelte/store";

export const scrollPosition = readable<number>(0, (set) => {
	window.addEventListener("scroll", () => {
		set(window.scrollY);
	});
});

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
