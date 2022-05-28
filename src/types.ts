namespace preprocessor {
	export namespace html {
		export type comment = {
			instruction: string;
			expression?: string;
			uid: string;
			value: string;
		};

		export type tagAttribute = {
			value: string;
			instruction: string;
			delimiter?: "'" | '"';
			content?: string;
		};
	}
}

type preprocessorVariables = {
	[key: string]: any;
};

export { preprocessor, preprocessorVariables };
