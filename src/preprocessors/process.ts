import { processComments } from "./comment";
import { processTags } from "./tagAttribute";
import { preprocessorVariables } from "../types";
import pretty from "pretty";

/**
 * Execute HTML preprocessor on the given data string with given variables.
 * @param path HTML string to process.
 * @param variables Variables used with the preprocessors.
 * @returns Processed data string with HTML preprocessors.
 */
function process(data: string, variables: preprocessorVariables) {
	data = processComments(data, variables);
	data = processTags(data);

	data = pretty(data, { ocd: true });
	return data;
}

export { process };
