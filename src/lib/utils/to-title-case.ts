export function toTitleCase(str: string) {
	const val = str.replace(/\b\w/g, (c) => c.toUpperCase());
	return val;
}
