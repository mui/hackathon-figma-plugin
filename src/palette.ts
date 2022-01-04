const createNewStyle = (name: string) => {
  const style = figma.createPaintStyle();
  style.name = name;
  return style;
};

const createPaintStyleWithColor = (
  name: string,
  color: Record<'r' | 'g' | 'b' | 'a', number>,
  existingStyle?: PaintStyle,
) => {
  const style = existingStyle || createNewStyle(name);

  if (!color) {
    return;
  }
  try {
    const { a: opacity, ...rgb } = color;
    style.paints = [{ type: 'SOLID', color: rgb, opacity }];
  } catch (error) {
    console.log('error', error);
  }
};

type Color = { name: string; value: Record<'r' | 'g' | 'b' | 'a', number> };

function isColor(obj: Record<string, unknown>): obj is Color {
  return !!obj.value && !!obj.name;
}

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
    res.map(async ({ name, value }) => {
      if (allStylesMap.get(name)) {
        updatedStylesCount++;
      }

      return createPaintStyleWithColor(name, value, allStylesMap.get(name));
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
