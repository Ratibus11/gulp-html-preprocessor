// Utils
import { preprocessorVariables } from "./types";
import { obj, TransformCallback } from "through2";

// Preprocessor
import { process as processFile } from "./preprocessors/process";

/**
 * Extension's entry point. Process all files which matches with gulp.src's globs.
 * @param options Variables to process. Can be any JS-exacutable expression.
 */
function process(options: preprocessorVariables = {}) {
	return obj(
		(file: any, encoding: BufferEncoding, callback: TransformCallback) => {
			let data = file.contents.toString(encoding);
			data = processFile(data, options);
			file.contents = Buffer.from(data);

			callback(null, file);
		}
	);
}

export { process };
