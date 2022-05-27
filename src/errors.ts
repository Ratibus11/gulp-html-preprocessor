function readFile(path: string, error: unknown): never {
	display(`reading file '${path}'`, error);
}

function unsupportedInstruction(instruction: string, comment: string): never {
	display(
		`processing instruction '${instruction}' in '${comment}'`,
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

function notInIf(instruction: string, comment: string): never {
	display(
		`processing instruction '${instruction}' in '${comment}'`,
		"No in 'if' preprocessor."
	);
}

export { readFile, unsupportedInstruction, notInIf };
