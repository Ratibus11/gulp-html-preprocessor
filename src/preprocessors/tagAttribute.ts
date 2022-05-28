import { preprocessor } from "../types";
import { normalize } from "path";
import {
	CannotNormalizePath,
	MissingValue,
	UnexpectedPreprocessor,
} from "../errors/preprocessor/attribute";
require("dotenv").config();

const dotEnvIdentifier = "GHP_";

function processTags(data: string) {
	let preprocessors = getPreprocessors(data);

	preprocessors.forEach((preprocessor) => {
		switch (preprocessor.instruction) {
			case "asset":
				data = processAsset(data, preprocessor);
		}
	});

	return data;
}

function processAsset(data: string, preprocessor: preprocessor.html.tag) {
	const defaultPath = "assets/";

	if (preprocessor.instruction != "asset") {
		throw new UnexpectedPreprocessor(preprocessor);
	}

	if (preprocessor.value == "undefined") {
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

function getPreprocessors(data: string) {
	const tagRegex = /<(?!!--|\/)(.*?)(?!--)>/g;
	const preprocessorWithoutValueRegex = /@(.[^=]*?)(?:$|\s)/g;
	const preprocessorWithoutQuotesRegex =
		/@(.[^\s]*?)\s{0,}=\s{0,}([^"|']*?)(?:$|\s)/g;
	const preprocessorWithQuotesRegex = /@(.[^\s]*?)\s{0,}=\s{0,}("|')(.*?)\2/g;

	let output: preprocessor.html.tag[] = [];

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

function getDotEnvName(name: string) {
	return dotEnvIdentifier + name;
}

export { processTags };
