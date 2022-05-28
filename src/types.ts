namespace preprocessor {
	export namespace html {
		export type comment = {
			instruction: string;
			expression?: string;
			uid: string;
			value: string;
		};

		export type tag = {
			value: string;
			instruction: string;
			delimiter?: "'" | '"';
			content?: string;
		};
	}
}

type preprocessorVariables = {
	[key: string]: string | number | boolean;
};

export { preprocessor, preprocessorVariables };
