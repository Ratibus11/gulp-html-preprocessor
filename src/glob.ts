import { glob } from "glob";

export function processGlob(globValue: string): string[] {
	return glob.sync(globValue);
}
