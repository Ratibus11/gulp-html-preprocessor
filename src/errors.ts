import { preprocessor } from "./types";

function readFile(path: string, error: unknown): never {
	display(`reading file '${path}'`, error);
}

function unsupportedInstruction(
	preprocessor: preprocessor.html.comment
): never {
	display(
		`processing instruction '${preprocessor.instruction}' in '${preprocessor.value}'`,
		"Instruction not supported."
	);
}

function display(whileMessage: string, error?: unknown): never {
	if (error) {
		throw `Error while ${whileMessage}: ${error}`;
	} else {
		throw `Error while ${whileMessage}.`;
	}
}

function notInIf(preprocessor: preprocessor.html.comment): never {
	display(
		`processing instruction '${preprocessor.instruction}' in '${preprocessor.value}'`,
		"No in 'if' preprocessor."
	);
}

function ifNotClosed(): never {
	display(`processing file preprocessor`, "'endif' enclosure not found.");
}

function noExpression(preprocessor: preprocessor.html.comment): never {
	display(
		`processing instruction '${preprocessor.instruction}' in '${preprocessor.value}'`,
		"No expression conditonnal."
	);
}

function endifWithExpression(preprocessor: preprocessor.html.comment): never {
	display(
		`processing instruction '${preprocessor.instruction}' in '${preprocessor.value}'`,
		"'endif' preprocessor cannot have conditionnal expression."
	);
}

export {
	readFile,
	unsupportedInstruction,
	notInIf,
	ifNotClosed,
	noExpression,
	endifWithExpression,
};
