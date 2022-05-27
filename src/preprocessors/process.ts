// Utils
import { extname } from "path";
import { preprocessorVariables } from "../types";

// Preprocessors
import { process as processHtml } from "./html/process";

/**
 * Process a given file with the preprocessor.
 * @param path
 * @note The preprocessor's bevaharior depends of the file's extension.
 *       If the preprocessor don't support the extension, nothing will happen.
 */
function processFile(path: string, variables: preprocessorVariables): void {
	switch (extname(path)) {
		case ".html":
			processHtml(path, variables);
	}
}

export { processFile };
