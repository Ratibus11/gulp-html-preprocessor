import { preprocessor, preprocessorVariables } from "../types";
import {
	MissingEndIf,
	MissingExpression,
	NotInIf,
	UnexpectedExpression,
	UnexpectedPreprocessor,
	PreprocessorNotFound,
} from "../errors/preprocessor/comment";
import { generate } from "../utils/unique";

const regex = /<!--\s{0,}@(.*?)\s{1,}(.*?)\s{0,}-->/gi;

/**
 * Process comments preprocessors in the given data.
 * @param data HTML string to process.
 * @param variables Variables used with the preprocessors.
 * @returns Comments preprocessors-processed HTML string.
 */
function processComments(
	data: string,
	variables: preprocessorVariables
): string {
	let preprocessors = getPreprocessors(data);

	while (preprocessorsExists(preprocessors, data)) {
		preprocessors.forEach((preprocessor) => {
			if (preprocessorsExists([preprocessor], data)) {
				switch (preprocessor.instruction) {
					case "if":
						data = processIf(
							preprocessor,
							preprocessors,
							variables,
							data
						);
						break;
					case "elseif":
					case "else":
					case "endif":
						throw new NotInIf(preprocessor);
				}
			}
		});
	}

	return data;
}

/**
 * Process encountered `if`.
 * @param preprocessor `if` preprocessor to process.
 * @param preprocessors All HTML string's preprocessors.
 * @param variables Variables used with the preprocessors.
 * @param data HTML string to process.
 * @returns `if` comment preprocessor-processed (with its `elseif`, `else` and `endif`) HTML string.
 * @throws {UnexpectedPreprocessor} Preprocessor instruction is not `if`.
 * @throws {UnexpectedExpression} `endif` cannot have expression.
 */
function processIf(
	preprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[],
	variables: preprocessorVariables,
	data: string
): string {
	if (preprocessor.instruction != "if") {
		throw new UnexpectedPreprocessor(preprocessor);
	}

	var endIf = getNextSameLevelPreprocessor(preprocessor, preprocessors, [
		"endif",
	]);

	var startContent = preprocessor;

	while (true) {
		if (startContent.instruction == "endif") {
			if (startContent.expression != "") {
				throw new UnexpectedExpression(startContent);
			}
			return data;
		}

		var endContent = getNextSameLevelPreprocessor(
			preprocessor,
			preprocessors,
			["elseif", "else", "endif"]
		);

		if (evaluateCondition(startContent, variables)) {
			let content = data.substring(
				data.indexOf(startContent.value) + startContent.value.length,
				data.indexOf(endContent.value)
			);
			let removed = data.substring(
				data.indexOf(startContent.value),
				data.indexOf(endIf.value) + endIf.value.length
			);

			data = data.replace(removed, content);
		} else {
			let removed = data.substring(
				data.indexOf(startContent.value),
				data.indexOf(endContent.value) +
					(endContent.instruction == "endif"
						? endContent.value.length
						: 0)
			);
			data = data.replace(removed, "");
		}

		startContent = endContent;
	}
}

/**
 * Get HTML string's preprocessors.
 * @param data HTML string to extract preprocessors.
 * @returns Array of preprocessors.
 */
function getPreprocessors(data: string): preprocessor.html.comment[] {
	let preprocessors: preprocessor.html.comment[] = [];

	[...data.matchAll(regex)].forEach((match) => {
		const comment = match[0];
		const instruction = match[1];
		const expression = match[2];

		preprocessors.push({
			value: comment,
			instruction: instruction,
			expression: expression,
			uid: generate(
				preprocessors.map((preprocessor) => {
					return preprocessor.uid;
				})
			),
		});
	});

	return preprocessors;
}

/**
 * Evaluate the given preprocessor with the given variables (used if needed).
 * @param preprocessor Preprocessor to evaluate its condition.
 * @param variables
 * @returns Evaluation's result.
 * @throws {UnexpectedPreprocessor} Preprocessor instruction is not `if`, `elseif` or `else`.
 * @throws {MissingExpression} Preprocessor must have expression (only if not `else`).
 */
function evaluateCondition(
	preprocessor: preprocessor.html.comment,
	variables: preprocessorVariables
): boolean {
	if (!["if", "elseif", "else"].includes(preprocessor.instruction)) {
		throw new UnexpectedExpression(preprocessor);
	}

	if (preprocessor.instruction == "else") {
		return true;
	}

	if (preprocessor.expression == "") {
		throw new MissingExpression(preprocessor);
	}

	const condition = preprocessor.expression!.replace(/(\\|'|"|`)/g, "\\$1");

	const variablesNames = Object.keys(variables)
		.map((variable) => {
			return `'${variable}'`;
		})
		.join(",");
	const expression = `'return ${condition}'`;
	const variablesValues = Object.values(variables).map((variable) => {
		if (typeof variable === "string") {
			return `'${variable.replace(/(\\|'|"|`)/g, "\\$1")}'`;
		} else {
			return variable;
		}
	});
	if (variablesNames != "") {
		return eval(
			`new Function(${variablesNames}, ${expression})(${variablesValues})`
		);
	}
	return eval(`new Function(${expression})()`);
}

/**
 * Check if given preprocessors exist in the given data.
 * @param preprocessors Preprocessors to check their existance.
 * @param data HTML string to check.
 * @returns `true` if at least one preprocessor exists in the data string. `false` otherwise.
 */
function preprocessorsExists(
	preprocessors: preprocessor.html.comment[],
	data: string
): boolean {
	return (
		preprocessors.findIndex((preprocessor) => {
			return data.includes(preprocessor.value);
		}) != -1
	);
}

/**
 *
 * @param startPreprocessor Preprocessor to start research.
 * @param preprocessors All preprocessors to search.
 * @param names Preprocessors instructions to find.
 * @returns First same-level preprocessor where instruction is in `names`.
 * @throws {UnexpectedPreprocessor} If `startPreprocessor`'s instruction is `endif`.
 */
function getNextSameLevelPreprocessor(
	startPreprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[],
	names: string[]
): preprocessor.html.comment {
	if (startPreprocessor.instruction == "endif") {
		throw new UnexpectedPreprocessor(startPreprocessor);
	}

	var index = getPreprocessorIndex(startPreprocessor, preprocessors);

	var ifDepth = 0;
	for (let i = index + 1; i < preprocessors.length; i++) {
		let preprocessor = preprocessors[i];

		if (names.includes(preprocessor.instruction) && ifDepth == 0) {
			return preprocessor;
		}

		if (preprocessor.instruction == "if") {
			ifDepth++;
		} else if (preprocessor.instruction == "endif") {
			ifDepth--;
		}
	}

	throw new MissingEndIf();
}

/**
 * Get preprocessor's index in preprocessors array.
 * @param preprocessor Preprocessor to find.
 * @param preprocessors Preprocessors list to find preprocessor's index.
 * @returns `preprocessor`'s index.
 * @throws {PreprocessorNotFound} `preprocessor` is not in `preprocessors`.
 */
function getPreprocessorIndex(
	preprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[]
): number {
	let index = preprocessors.findIndex((preprocessor) => {
		return preprocessor.uid == preprocessor.uid;
	});

	if (index == -1) {
		throw new PreprocessorNotFound(preprocessor, preprocessors);
	}

	return index;
}

export { processComments };
