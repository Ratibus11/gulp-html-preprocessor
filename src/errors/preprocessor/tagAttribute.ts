import { PreprocessorException } from "../exception";
import * as types from "../../types";

const exceptionType = "attribute";

/**
 * Generic exception for HTML tag attribute preprocessors
 */
class TagPreprocessorException extends PreprocessorException {
	constructor(
		errorMessage: string,
		preprocessor: types.preprocessor.html.tagAttribute
	) {
		if (preprocessor) {
			super(`${errorMessage} in ${preprocessor.value}`, exceptionType);
		} else {
			super(errorMessage, exceptionType);
		}
	}
}

/**
 * Unexpected preprocessor in a part of the code.
 */
class UnexpectedPreprocessor extends TagPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.tagAttribute) {
		super(
			`Unexpected preprocessor '${preprocessor.instruction}'.`,
			preprocessor
		);
	}
}

/**
 * HTML tag attribute preprocessor have no value.
 */
class MissingValue extends TagPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.tagAttribute) {
		super(`Missing value.`, preprocessor);
	}
}

/**
 * Cannot normalize path.
 */
class CannotNormalizePath extends TagPreprocessorException {
	constructor(
		path: string,
		preprocessor: types.preprocessor.html.tagAttribute
	) {
		super(`Cannot normalize path '${path}'`, preprocessor);
	}
}

export { UnexpectedPreprocessor, MissingValue, CannotNormalizePath };
