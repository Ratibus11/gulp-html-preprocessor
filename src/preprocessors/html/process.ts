import { process as processComment } from "./comment";
import { process as processTagAttribute } from "./tagAttribute";
import { preprocessorVariables } from "../../types";

import { load } from "../../utils/file";
import * as types from "../../types";

/**
 * Execute HTML preprocessor on the given path with given variables.
 * @param path HTML file to process.
 * @param variables Variables to use during the process.
 */
function process(path: string, variables: preprocessorVariables): string {
	var data = load(path);

	data = processComment(data, variables);
	data = processTagAttribute(data);

	return data;
}

export { process };
