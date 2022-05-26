import { process as processComment } from "./comment";
import { process as processTagAttribute } from "./tagAttribute";
import { preprocessorVariables } from "../../types";

import { loadFile } from "../../utils/loadFile";
import * as types from "../../types";

export function process(path: string, variables: preprocessorVariables): void {
	var data = loadFile(path);

	getReplacements(data, variables).forEach((remplacement) => {
		data.replace(remplacement.original, remplacement.new);
	});
}

function getReplacements(
	data: string,
	variables: preprocessorVariables
): types.replacements {
	return [processComment(data, variables), processTagAttribute(data)].flat();
}
