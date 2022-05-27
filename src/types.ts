namespace preprocessor {
	export namespace html {
		export type comment = {
			value: string;
			instruction: string;
			expression?: string;
			uid: string;
		};
	}
}

type preprocessorVariables = {
	[key: string]: string | number | boolean;
};

export { preprocessor, preprocessorVariables };
