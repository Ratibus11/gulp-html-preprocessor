import { UtilsException } from "../exception";

type fileAction = "reading";

class FileException extends UtilsException {
	constructor(path: string, action: fileAction, error: unknown) {
		super(`Error while ${action} on '${path}: ${error}'`);
	}
}

class CannotReadException extends FileException {
	constructor(path: string, error: unknown) {
		super(path, "reading", error);
	}
}

export { CannotReadException };
