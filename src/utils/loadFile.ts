import { readFileSync } from "fs";

/**
 * Load the given file and convert it to string.
 * @param path Path to open.
 * @returns File's string-converted data.
 */
export function loadFile(path: string): string | never {
	try {
		return readFileSync(path).toString();
	} catch (error) {
		throw `An error occurred whil reading file '${path}': ${error}`;
	}
}
