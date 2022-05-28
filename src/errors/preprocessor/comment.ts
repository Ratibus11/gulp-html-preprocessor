import { PreprocessorException } from "../exception";
import * as types from "../../types";

const exceptionType = "comment";

/**
 * @throws Generic exception for HTML comments preprocessors
 */
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

/**
 * @throws Unexpected preprocessor in a part of the code.
 */
class UnexpectedPreprocessor extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super(
			`Unexpected preprocessor '${preprocessor.instruction}'.`,
			preprocessor
		);
	}
}

/**
 * @throws HTML comment preprocessor have no expression.
 */
class UnexpectedExpression extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super("Unexpected preprocessor expression", preprocessor);
	}
}

/**
 * @throws HTML comment preprocessor have no expression.
 */
class MissingExpression extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super("Missing preprocessor expression", preprocessor);
	}
}

/**
 * `elseif`/`else`/`endif` intruction encountered while without encountered `if ` instruction.
 */
class NotInIf extends CommentPreprocessorException {
	constructor(preprocessor: types.preprocessor.html.comment) {
		super("Not in 'if' preprocessor.", preprocessor);
	}
}

/**
 * Missing `endif` preprocessor.
 */
class MissingEndIf extends CommentPreprocessorException {
	constructor() {
		super("Missing 'endif' preprocessor.");
	}
}

export {
	UnexpectedExpression,
	UnexpectedPreprocessor,
	MissingExpression,
	NotInIf,
	MissingEndIf,
};
