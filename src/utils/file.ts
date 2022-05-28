import { readFileSync } from "fs";
import { CannotReadException } from "../errors/utils/file";

/**
 * Load the given file and convert it to string.
 * @param path Path to open.
 * @returns File's string-converted data.
 */
function load(path: string): string {
	try {
		return readFileSync(path).toString();
	} catch (error) {
		throw new CannotReadException(path, error);
	}
}

export { load };
