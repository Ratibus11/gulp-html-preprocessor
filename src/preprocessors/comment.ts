import { preprocessor, preprocessorVariables } from "../types";
import {
	MissingEndIf,
	MissingExpression,
	NotInIf,
	UnexpectedExpression,
} from "../errors/preprocessor/comment";
import { generate } from "../utils/unique";

const regex = /<!--\s{0,}@(.*?)\s{1,}(.*?)\s{0,}-->/gi;

function processComments(
	data: string,
	variables: preprocessorVariables
): string {
	let preprocessors = getPreprocessors(data);

	preprocessors.forEach((preprocessor) => {
		data = data.replace(preprocessor.value, preprocessor.uid);
	});

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

function processIf(
	preprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[],
	variables: preprocessorVariables,
	data: string
): string {
	if (preprocessor.instruction != "if") {
		throw new NotInIf(preprocessor);
	}

	var startIf = preprocessor;
	var endIf = getEndIf(preprocessor, preprocessors);

	var startContent = preprocessor;

	while (true) {
		if (startContent.instruction == "endif") {
			if (startContent.expression != "") {
				throw new UnexpectedExpression(startContent);
			}
			return data;
		}

		var endContent = getNextCondition(startContent, preprocessors);

		if (evaluateCondition(startContent, variables)) {
			let content = data.substring(
				data.indexOf(startContent.uid) + startContent.uid.length,
				data.indexOf(endContent.uid)
			);
			let removed = data.substring(
				data.indexOf(startContent.uid),
				data.indexOf(endIf.uid) + endIf.uid.length
			);

			data = data.replace(removed, content);
		} else {
			let removed = data.substring(
				data.indexOf(startContent.uid),
				data.indexOf(endContent.uid) +
					(endContent.instruction == "endif"
						? endContent.uid.length
						: 0)
			);
			data = data.replace(removed, "");
		}

		startContent = endContent;
	}
}

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
				data,
				preprocessors.map((preprocessor) => {
					return preprocessor.uid;
				})
			),
		});
	});

	return preprocessors;
}

function evaluateCondition(
	preprocessor: preprocessor.html.comment,
	variables: preprocessorVariables
): boolean {
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

function preprocessorsExists(
	preprocessors: preprocessor.html.comment[],
	data: string
): boolean {
	return (
		preprocessors.findIndex((preprocessor) => {
			return data.includes(preprocessor.uid);
		}) != -1
	);
}

function getEndIf(
	preprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[]
): preprocessor.html.comment {
	return getNextSameLevelElement(preprocessor, preprocessors, ["endif"]);
}

function getNextCondition(
	preprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[]
): preprocessor.html.comment {
	return getNextSameLevelElement(preprocessor, preprocessors, [
		"elseif",
		"else",
		"endif",
	]);
}

function getNextSameLevelElement(
	startPreprocessor: preprocessor.html.comment,
	preprocessors: preprocessor.html.comment[],
	names: string[]
): preprocessor.html.comment {
	var index = getPreprocessorIndex(startPreprocessor.uid, preprocessors);

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

function getPreprocessorIndex(
	uid: string,
	preprocessors: preprocessor.html.comment[]
) {
	return preprocessors.findIndex((preprocessor) => {
		return preprocessor.uid == uid;
	});
}

export { processComments };
