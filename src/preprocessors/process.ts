import { processComments } from "./comment";
import { processTags } from "./tagAttribute";
import { preprocessorVariables } from "../types";

import { load } from "../utils/file";

/**
 * Execute HTML preprocessor on the given path with given variables.
 * @param path HTML file to process.
 * @param variables Variables to use during the process.
 */
function process(path: string, variables: preprocessorVariables): string {
	var data = load(path);

	data = processComments(data, variables);
	data = processTags(data);
	console.log(data);

	return data;
}

export { process };
