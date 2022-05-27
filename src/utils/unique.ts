import { randomBytes } from "crypto";

const size = 20;

/**
 * Generate a random string key
 * @param keys If given, will generate a key that is not existing in the array
 * @returns Generated key
 */
function generate(data: string, keys?: string[]): string {
	if (keys == undefined) {
		return randomBytes(size).toString("hex");
	}

	let newKey;
	do {
		newKey = randomBytes(size).toString("hex");
	} while (keys.includes(newKey) && data.includes(newKey));
	return newKey;
}

export { generate };
