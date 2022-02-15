import { Color, isColor } from './types';

const createNewStyle = (name: string) => {
  const style = figma.createPaintStyle();
  style.name = name;
  return style;
};

const createPaintStyleWithColor = ({ name, value, comment }: Color, existingStyle?: PaintStyle) => {
  const style = existingStyle || createNewStyle(name);

  if (!value) {
    return;
  }
  try {
    const { a: opacity, r, g, b } = value;
    style.paints = [{ type: 'SOLID', color: { r, g, b }, opacity }];
    style.description = comment || '';
  } catch (error) {
    console.error(error);
  }
};

function flattenObjectToArray(obj: Record<string, unknown>, acc = []): Color[] {
  return Object.values(obj).reduce<Color[]>((subAcc: Color[], subObj: Record<string, unknown>) => {
    if (isColor(subObj)) {
      subAcc.push(subObj);
    } else {
      flattenObjectToArray(subObj, subAcc);
    }
    return subAcc;
  }, acc);
}

export async function importPalette(
  importedPalette: Record<'color', Record<string, unknown>>,
): Promise<{
  success: boolean;
  newStylesCount?: number;
  preexistingStylesCount?: number;
  updatedStylesCount?: number;
}> {
  const res = flattenObjectToArray(importedPalette.color);
  const allStyles = figma.getLocalPaintStyles();
  const allStylesMap = new Map(allStyles.map((style) => [style.name, style]));
  let updatedStylesCount = 0;

  return await Promise.all(
    res.map(async (color) => {
      const existingColor = allStylesMap.get(color.name);

      if (existingColor) {
        updatedStylesCount++;
      }

      return createPaintStyleWithColor(color, existingColor);
    }),
  ).then(
    () => ({
      success: true,
      newStylesCount: res.length,
      preexistingStylesCount: allStyles.length,
      updatedStylesCount,
    }),
    () => ({ success: false }),
  );
}
