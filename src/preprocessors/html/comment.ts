import * as types from "../../types";
import { preprocessor, preprocessorVariables } from "../../types";
import { unsupportedInstruction, notInIf } from "../../errors";
import { generate } from "../../utils/unique";

const regex = /<!--\s{0,}@(.*?)\s{1,}(.*?)\s{0,}-->/gi;

var ifDepth = 0;
var startIf: preprocessor.html.comment;
var startContent: preprocessor.html.comment;
var endContent: preprocessor.html.comment;
var endIf: preprocessor.html.comment;
var validCondition = false;

function process(data: string, variables: preprocessorVariables): string {
	const preprocessors = getUids(data);
	data = convertToUids(data, preprocessors);

	while (doPreprocessorsExists(data, preprocessors)) {
		preprocessors.every((preprocessor, index) => {
			switch (preprocessor.instruction) {
				case "if":
					ifDepth++;
					startIf = preprocessor;
					startContent = preprocessor;
					validCondition = evaluateCondition(preprocessor, variables);
					break;

				case "elseif":
				case "else":
					if (validCondition) {
						endContent = preprocessor;
						endIf =
							preprocessors[
								preprocessors
									.slice(index)
									.findIndex((preprocessor) => {
										return (
											preprocessor.instruction == "endif"
										);
									}) + index
							];

						let content = data
							.substring(
								data.indexOf(startContent.uid) +
									startContent.uid.length,
								data.lastIndexOf(endContent.uid)
							)
							.trim();

						let removed = data.substring(
							data.indexOf(startIf.uid),
							data.lastIndexOf(endIf.uid) + endIf.uid.length
						);

						data = data.replace(removed, content);
						return false;
					} else {
						startContent = preprocessor;
						validCondition = evaluateCondition(
							preprocessor,
							variables
						);
					}
			}

			return true;
		});
	}

	console.log(data);

	return data;
}

function evaluateCondition(
	preprocessor: preprocessor.html.comment,
	variables: preprocessorVariables
): boolean {
	const condition = preprocessor.expression!.replace(/(\\|'|"|`)/g, "\\$1");

	const variablesNames = Object.keys(variables)
		.map((variable) => {
			return `'${variable}'`;
		})
		.join(",");
	const expression = `'return ${condition}'`;
	const variablesValues = Object.values(variables)
		.map((variable) => {
			if (typeof variable === "string") {
				return `'${variable.replace(/(\\|'|"|`)/g, "\\$1")}'`;
			} else {
				return variable;
			}
		})
		.join(",");

	if (variablesNames != "") {
		return eval(
			`new Function(${variablesNames}, ${expression})(${variablesValues})`
		);
	} else {
		return eval(`new Function(${expression})()`);
	}
}

/**
 *
 * @param data
 * @returns
 */
function getUids(data: string): preprocessor.html.comment[] | never {
	var preprocessors: preprocessor.html.comment[] = [];

	[...data.matchAll(regex)].forEach((match) => {
		const comment = match[0];
		const instruction = match[1];
		const expression = match[2];

		preprocessors.push({
			value: comment,
			instruction: instruction,
			expression: expression,
			uid: generate(
				preprocessors.map((uid) => {
					return uid.uid;
				})
			),
		});
	});

	return preprocessors;
}

function convertToUids(
	data: string,
	preprocessors: preprocessor.html.comment[]
): string {
	preprocessors.forEach((preprocessor) => {
		data = data.replace(preprocessor.value, preprocessor.uid);
	});

	return data;
}

/**
 * If the given preprocessors exists in the given data.
 * @param data String to analyze.
 * @param preprocessors Preprocessor to find their UIDs.
 * @returns `true` if at least one preprocessor's UID exists in the given `data`. `false` otherwise.
 */
function doPreprocessorsExists(
	data: string,
	preprocessors: preprocessor.html.comment[]
) {
	return (
		preprocessors.findIndex((preprocessor) => {
			return data.includes(preprocessor.uid) == true;
		}) != -1
	);
}

export { process };
