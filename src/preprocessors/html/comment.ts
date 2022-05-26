import * as types from "../../types";
import { preprocessorVariables } from "../../types";

const regex = /<!--\s{0,}@(.*?)\s{1,}(.*?)\s{0,}-->/gi;

export function process(
	data: string,
	variables: preprocessorVariables
): types.replacements {
	var output: types.replacements = [];

	[...data.matchAll(regex)].forEach((match) => {
		const instruction = match[1];
		const expression = match[2];

		// To continue
	});

	return output;
}
