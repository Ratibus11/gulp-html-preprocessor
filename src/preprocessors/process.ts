import { process as processComment } from "./comment";
import { process as processTagAttribute } from "./tagAttribute";
import { preprocessorVariables } from "../types";

import { load } from "../utils/file";

/**
 * Execute HTML preprocessor on the given path with given variables.
 * @param path HTML file to process.
 * @param variables Variables to use during the process.
 */
function process(path: string, variables: preprocessorVariables): string {
	var data = load(path);

	data = processComment(data, variables);
	console.log(data);
	data = processTagAttribute(data);

	return data;
}

export { process };
