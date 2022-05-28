import { PreprocessorException } from "../exception";
import * as types from "../../types";

const exceptionType = "comment";

class CommentPreprocessorException extends PreprocessorException {
	constructor(
		errorMessage: string,
		preprocessor?: types.preprocessor.html.comment
	) {
		if (preprocessor) {
			super(`${errorMessage} in ${preprocessor.value}`, exceptionType);
		} else {
			super(errorMessage, exceptionType);
		}
	}
}

class UnexpectedExpression extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super("Unexpected preprocessor expression", preprocessor);
	}
}

class MissingExpression extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super("Missing preprocessor expression", preprocessor);
	}
}

class NotInIf extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super("Not in 'if' preprocessor.", preprocessor);
	}
}

class MissingEndIf extends CommentPreprocessorException {
	constructor() {
		super("Missing 'endif' preprocessor.");
	}
}

export { UnexpectedExpression, MissingExpression, NotInIf, MissingEndIf };
