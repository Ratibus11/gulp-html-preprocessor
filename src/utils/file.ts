import { readFileSync } from "fs";

import { readFile } from "../errors";

/**
 * Load the given file and convert it to string.
 * @param path Path to open.
 * @returns File's string-converted data.
 */
function load(path: string): string | never {
	try {
		return readFileSync(path).toString();
	} catch (error) {
		readFile(path, error);
	}
}

export { load };
