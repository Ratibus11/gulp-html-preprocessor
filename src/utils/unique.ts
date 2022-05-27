import { randomBytes } from "crypto";

const size = 20;

/**
 * Generate a random string key
 * @param keys If given, will generate a key that is not existing in the array
 * @returns Generated key
 */
function generate(keys?: string[]): string {
	return randomBytes(size).toString("hex");
}

export { generate };
