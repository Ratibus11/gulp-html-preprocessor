class GulpHtmlPreprocessorException extends Error {
	constructor(message: string) {
		super(message);
	}
}

class PreprocessorException extends GulpHtmlPreprocessorException {
	constructor(errorMessage: string, type: "comment" | "attribute") {
		super(
			`Exception while executing '${type}' preprocessor: ${errorMessage}`
		);
	}
}

class UtilsException extends GulpHtmlPreprocessorException {
	constructor(errorMessage: string) {
		super(`Exception while running util process: ${errorMessage}`);
	}
}

export { PreprocessorException, UtilsException };
