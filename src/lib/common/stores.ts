import { readable } from "svelte/store";

export const scrollPosition = readable<number>(0, (set) => {
	window.addEventListener("scroll", (e) => {
		set(window.scrollY);
	});
});

export const windowSize = readable<{ width: number; height: number }>(
	{
		width: window.innerWidth,
		height: window.innerHeight,
	},
	(set) => {
		window.addEventListener("resize", (e) => {
			set({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		});
	},
);
