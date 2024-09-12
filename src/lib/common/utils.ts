const _UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const _LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const _DIGITS = "1234567890";
const _SYMBOLS = "!@#$%^&*()_+-=[]{};':,.<>?";

/**
 * Object containing lists of basic ASCII characters
 */
export const CHARACTERS = {
	uppercase: _UPPERCASE.split(""),
	lowercase: _LOWERCASE.split(""),
	digits: _DIGITS.split(""),
	special: _SYMBOLS.split(""),
};

/**
 * Checks to see if specifed HTMLElement is at least partially visible in the DOM
 * @param el Target element
 */
export function elementVisible(el: HTMLElement): boolean {
	const rect = el.getBoundingClientRect();

	const height = window.innerHeight || document.documentElement.clientHeight;
	const width = window.innerWidth || document.documentElement.clientWidth;

	return (
		((rect.top >= 0 && rect.top <= height) ||
			(rect.bottom >= 0 && rect.bottom <= height)) &&
		((rect.left >= 0 && rect.left <= width) ||
			(rect.right >= 0 && rect.right <= width))
	);
}
/**
 * Returns a random integer between 0 and max.
 * @param max Maximum value
 */
export function randomInt(max = 1): number {
	return Math.floor(Math.random() * max);
}

/**
 * Returns a random string with specified characters.
 * @param length Length of the string
 * @param [uppercase=true] Include uppercase letters or not
 * @param [lowercase=true] Include lowercase letters or not
 * @param [digits=true] Include digits or not
 */
export function randomString(
	length: number,
	uppercase = true,
	lowercase = true,
	digits = true,
): string {
	const charset: string[] = [];

	if (uppercase) charset.push(...CHARACTERS.uppercase);
	if (lowercase) charset.push(...CHARACTERS.lowercase);
	if (digits) charset.push(...CHARACTERS.digits);

	let result = "";
	for (let i = 0; i < length; i++) {
		result += charset[randomInt(charset.length)];
	}

	return result;
}
