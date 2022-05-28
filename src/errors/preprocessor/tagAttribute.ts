import { PreprocessorException } from "../exception";
import * as types from "../../types";

const exceptionType = "attribute";

class TagPreprocessorException extends PreprocessorException {
	constructor(
		errorMessage: string,
		preprocessor: types.preprocessor.html.tagAttribute
	) {
		const message = "Exception while processing comment preprocessor";

		if (preprocessor) {
			super(`${errorMessage} in ${preprocessor.value}`, exceptionType);
		} else {
			super(errorMessage, exceptionType);
		}
	}
}

class UnexpectedPreprocessor extends TagPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.tagAttribute) {
		super(
			`Unexpected preprocessor '${preprocessor.instruction}'.`,
			preprocessor
		);
	}
}

class MissingValue extends TagPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.tagAttribute) {
		super(`Missing value.`, preprocessor);
	}
}

class CannotNormalizePath extends TagPreprocessorException {
	constructor(
		path: string,
		preprocessor: types.preprocessor.html.tagAttribute
	) {
		super(`Cannot normalize path '${path}'`, preprocessor);
	}
}

export { UnexpectedPreprocessor, MissingValue, CannotNormalizePath };
