const createNewStyle = (name: string) => {
  const style = figma.createPaintStyle();
  style.name = name;
  return style;
};

const createPaintStyleWithColor = (
  name: string,
  color: Record<'red' | 'green' | 'blue' | 'alpha', number>,
  existingStyle?: PaintStyle,
) => {
  const style = existingStyle || createNewStyle(name);

  if (!color) {
    return;
  }
  try {
    const { red: r, green: g, blue: b, alpha: opacity } = color;
    style.paints = [{ type: 'SOLID', color: { r, g, b }, opacity }];
  } catch (error) {
    console.log('error', error);
  }
};

type Color = { name: string; value: Record<'red' | 'green' | 'blue' | 'alpha', number> };

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

export async function importPalette(importedPalette: Record<'color', Record<string, unknown>>) {
  const res = flattenObjectToArray(importedPalette.color);
  const allStyles = figma.getLocalPaintStyles();
  const allStylesMap = new Map(allStyles.map((style) => [style.name, style]));

  return await Promise.all(
    res.map(async ({ name, value }) => {
      return createPaintStyleWithColor(name, value, allStylesMap.get(name));
    }),
  );
}
