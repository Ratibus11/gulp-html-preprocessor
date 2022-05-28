import { processComments } from "./comment";
import { processTags } from "./tagAttribute";
import { preprocessorVariables } from "../types";

/**
 * Execute HTML preprocessor on the given path with given variables.
 * @param path HTML file to process.
 * @param variables Variables to use during the process.
 */
function process(data: string, variables: preprocessorVariables): string {
	data = processComments(data, variables);
	data = processTags(data);

	return data;
}

export { process };
