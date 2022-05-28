import { processComments } from "./comment";
import { processTags } from "./tagAttribute";
import { preprocessorVariables } from "../types";

/**
 * Execute HTML preprocessor on the given data string with given variables.
 * @param path HTML string to process.
 * @param variables Variables used with the preprocessors.
 * @returns Processed data string with HTML preprocessors.
 */
function process(data: string, variables: preprocessorVariables): string {
	data = processComments(data, variables);
	data = processTags(data);

	return data;
}

export { process };
