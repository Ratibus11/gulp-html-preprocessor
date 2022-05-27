import { glob as globModule } from "glob";

/**
 * Process a glob request
 * @param globValue Glob string to evaluate
 * @returns All files that matche with the given globe.
 */
function glob(globs: string | string[]): string[] {
	if (Array.isArray(globs)) {
		return globs
			.map((glob) => {
				return globModule.sync(glob);
			})
			.flat();
	} else {
		return globModule.sync(globs);
	}
}

export { glob };
