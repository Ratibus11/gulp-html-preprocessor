export type replacement = {
	original: string;
	new: string;
};

export type replacements = replacement[];

export type preprocessorVariables = {
	[key: string]: string | number | boolean;
};
