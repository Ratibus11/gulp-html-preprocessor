import { processGlob } from "./glob";

export function preprocessor(
	globs: string[] | string,
	...options: string[]
): void {
	if (Array.isArray(globs)) {
		globs.forEach((glob) => {
			processGlob(glob).forEach((matche) => {
				processFile(matche);
			});
		});
	} else {
		processGlob(globs).forEach((matche) => {
			processFile(matche);
		});
	}
}

function processFile(filePath: string): void {
	console.log(filePath);
}
