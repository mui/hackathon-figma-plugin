import type { DesignToken } from 'style-dictionary';
import { importGridStyles } from './importGridStyles';
import { importPaintStyles } from './importPaintStyles';
import { DesignTokensByType, ImportPromise, isColor, isDesignToken, isSize } from './types';

function flattenObjectToArray(obj: Record<string, unknown>, acc = []): DesignToken[] {
  return Object.values(obj).reduce<DesignToken[]>(
    (subAcc: DesignToken[], subObj: Record<string, unknown>) => {
      if (isDesignToken(subObj)) {
        subAcc.push(subObj);
      } else {
        flattenObjectToArray(subObj, subAcc);
      }
      return subAcc;
    },
    acc,
  );
}

export function parsePayload(
  payload: Record<'color', Record<string, unknown>>,
): DesignTokensByType {
  return {
    PAINT: flattenObjectToArray(payload.color),
  };
}

const importer: { [k in StyleType]: (tokens: DesignToken[]) => ImportPromise } = {
  PAINT: (tokens) => {
    if (tokens.every(isColor)) {
      return importPaintStyles(tokens);
    }

    throw new Error("Tokens contain entries other than type color");
  },
  GRID: (tokens) => {
    if (tokens.every(isSize)) {
      return importGridStyles(tokens);
    }

    throw new Error("Tokens contain entries other than type color");
  },
  TEXT: () =>
    Promise.resolve({
      success: true,
      newStylesCount: 0,
      preexistingStylesCount: 0,
      updatedStylesCount: 0,
    }),
  EFFECT: () =>
    Promise.resolve({
      success: true,
      newStylesCount: 0,
      preexistingStylesCount: 0,
      updatedStylesCount: 0,
    }),
};

export async function importTokens(
  tokens: DesignTokensByType,
  { categories }: { categories: StyleType[] },
) {
  return Promise.all(categories.map((category) => importer[category](tokens[category])));
}
