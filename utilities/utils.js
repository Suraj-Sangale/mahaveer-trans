// className="([^"]+)"
// className={css("$1")}

import { constantsList } from "../constant";

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

export const getConstant = (key) => {
  return constantsList[key.toUpperCase()] ?? null;
};

export const scrollSectionIntoView = (id) => {
  const element = document.getElementById(id);

  if (element) {
    setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 1000)
  }
};