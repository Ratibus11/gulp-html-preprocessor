// Utils
import { glob } from "./utils/glob";
import { preprocessorVariables } from "./types";

// Preprocessor
import { process as processHTML } from "./preprocessors/process";

/**
 * Extension's entry point. Process all files which matches with the given globs.
 * @param globs Globs to process.
 * @param options Variables to process. Can be strings, numbers or booleans.
 */
function process(
	globs: string[] | string,
	variables?: preprocessorVariables
): void {
	glob(globs).forEach((match) => {
		processHTML(match, variables || {});
	});
}

export { process };
