import { createStyleImporter } from './createStyleImporter';
import { Color } from './types';

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

export const importPaintStyles = createStyleImporter<Color, PaintStyle>(
  figma.getLocalPaintStyles,
  createPaintStyleWithColor,
);
