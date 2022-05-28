import { preprocessor } from "../types";
import { normalize } from "path";
import {
	CannotNormalizePath,
	MissingValue,
	UnexpectedPreprocessor,
} from "../errors/preprocessor/tagAttribute";
require("dotenv").config();

const dotEnvIdentifier = "GHP_";

/**
 * Process comments preprocessors in the given data.
 * @param data HTML string to process.
 * @returns Comments preprocessors-processed HTML string.
 */
function processTags(data: string): string {
	let preprocessors = getPreprocessors(data);

	preprocessors.forEach((preprocessor) => {
		switch (preprocessor.instruction) {
			case "asset":
				data = processAsset(data, preprocessor);
		}
	});

	return data;
}

/**
 * Process encountered `asset`.
 * @param data HTML string to process.
 * @param preprocessor `asset` preprocessor to process.
 * @returns `asset` comment preprocessor-processed HTML string.
 * @throws {UnexpectedPreprocessor} Preprocessor instruction must be `asset`.
 * @throws {MissingValue} Preprocessor instruction cannot be empty.
 * @throws {CannotNormalizePath} Failed to normalize new path.
 */
function processAsset(
	data: string,
	preprocessor: preprocessor.html.tagAttribute
): string {
	const defaultPath = "/assets/";

	if (preprocessor.instruction != "asset") {
		throw new UnexpectedPreprocessor(preprocessor);
	}

	if (preprocessor.value == undefined) {
		throw new MissingValue(preprocessor);
	}

	try {
		let content = `src="${normalize(
			(eval(`process.env.${getDotEnvName("ASSET")}`) ?? defaultPath) +
				preprocessor.content
		)}"`;
		let removed = preprocessor.value;
		return data.replace(removed, content);
	} catch {
		throw new CannotNormalizePath(
			(eval(`process.env.${getDotEnvName("ASSET")}`) ?? defaultPath) +
				preprocessor.content,
			preprocessor
		);
	}
}

/**
 * Get HTML string's preprocessors.
 * @param data HTML string to extract preprocessors.
 * @returns Array of preprocessors.
 */
function getPreprocessors(data: string): preprocessor.html.tagAttribute[] {
	const tagRegex = /<(?!!--|\/)(.*?)(?!--)>/g;
	const preprocessorWithoutValueRegex = /@(.[^=]*?)(?:$|\s)/g;
	const preprocessorWithoutQuotesRegex =
		/@(.[^\s]*?)\s{0,}=\s{0,}([^"|']*?)(?:$|\s)/g;
	const preprocessorWithQuotesRegex = /@(.[^\s]*?)\s{0,}=\s{0,}("|')(.*?)\2/g;

	let output: preprocessor.html.tagAttribute[] = [];

	let tags = [...data.matchAll(tagRegex)].map((match) => {
		return match[1];
	});

	tags.forEach((tag) => {
		[...tag.matchAll(preprocessorWithoutValueRegex)].forEach((match) => {
			output.push({
				value: match[0],
				instruction: match[1],
			});
		});

		[...tag.matchAll(preprocessorWithoutQuotesRegex)].forEach((match) => {
			output.push({
				value: match[0],
				instruction: match[1],
				content: match[2],
			});
		});

		[...tag.matchAll(preprocessorWithQuotesRegex)].forEach((match) => {
			output.push({
				value: match[0],
				instruction: match[1],
				delimiter: match[2] == "'" ? '"' : '"',
				content: match[3],
			});
		});
	});

	return output;
}

/**
 * Return .env parameter's name
 * @param name Attribute's name.
 * @returns .env-converted attribute's name.
 */
function getDotEnvName(name: string) {
	return dotEnvIdentifier + name.toUpperCase();
}

export { processTags };
