// className="([^"]+)"
// className={css("$1")}

export const applyCSS = (
	classNames,
	style1 = {},
	style2 = {}
) => {
	return classNames
		.split(",")
		.map((name) => name.trim())
		.map((name) => {
			const class1 = style1?.[name] || "";
			const class2 = style2?.[name] || "";
			

			if (!class1 && !class2) {
				return `${name}_NOT_FOUND_IN_SCSS`;
			}
			return [class1, class2].filter(Boolean).join(" ");
		})
		.join(" ");
};
