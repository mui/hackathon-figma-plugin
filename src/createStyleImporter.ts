import type { DesignToken } from "style-dictionary";
import type { ImportPromise } from "./types";

export function createStyleImporter<T extends DesignToken, S extends BaseStyle>(
    getExistingStyles: () => S[],
    createNewStyle: (token: T, existingStyle: S) => void
  ): (tokens: Array<T>) => ImportPromise {
    const allStyles = getExistingStyles();
    const allStylesMap = new Map(allStyles.map((style) => [style.name, style]));
    let updatedStylesCount = 0;
  
    return async (tokens) => await Promise.all(
      tokens.map(async (color) => {
        const existingColor = allStylesMap.get(color.name);
  
        if (existingColor) {
          updatedStylesCount++;
        }
  
        return createNewStyle(color, existingColor);
      }),
    ).then(
      () => ({
        success: true,
        newStylesCount: tokens.length,
        preexistingStylesCount: allStyles.length,
        updatedStylesCount,
      }),
      () => ({ success: false }),
    );
  }