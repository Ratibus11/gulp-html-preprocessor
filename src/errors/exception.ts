/**
 * Generic exception for `gulp-html-preprocessor` extension
 */
class GulpHtmlPreprocessorException extends Error {
	constructor(message: string) {
		super(message);
	}
}

/**
 * Generic exception for preprocessors.
 */
class PreprocessorException extends GulpHtmlPreprocessorException {
	constructor(errorMessage: string, type: "comment" | "attribute") {
		super(
			`Exception while executing '${type}' preprocessor: ${errorMessage}`
		);
	}
}

export { PreprocessorException };
