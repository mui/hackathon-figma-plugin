import { decomposeColor, Theme, PaletteColor, alpha } from '@mui/material/styles';
import { capitalize } from '@mui/material/utils';

const findOrCreatePaintStyle = (name: string) => {
  const allStyles = figma.getLocalPaintStyles();
  let style = allStyles.find((style) => style.name === name);
  if (!style) {
    style = figma.createPaintStyle();
    style.name = name;
  }
  return style;
};

const createPaintStyleWithColor = (names: string[], color: string) => {
  const style = findOrCreatePaintStyle(names.join('/'));
  const { values: colorRgb } = decomposeColor(color);
  const [red, green, blue, opacity = 1] = colorRgb;
  style.paints = [
    { type: 'SOLID', color: { r: red / 255, g: green / 255, b: blue / 255 }, opacity },
  ];
};

export const importPaletteColor = async (name: string, palette: PaletteColor, theme: Theme) => {
  if (!palette) {
    return;
  }

  Object.entries(palette).forEach(([key, value]) => {
    const colorName = key === 'contrastText' ? 'contrast' : key;
    createPaintStyleWithColor([capitalize(name), capitalize(colorName)], value);
  });

  createPaintStyleWithColor(
    [capitalize(name), 'States', 'Outlined Resting Border'],
    alpha(palette.main, 0.5),
  );

  createPaintStyleWithColor(
    [capitalize(name), 'States', 'Contained Hover Background'],
    palette.dark,
  );

  createPaintStyleWithColor(
    [capitalize(name), 'States', 'Outlined Hover Background'],
    alpha(palette.main, theme.palette.action.hoverOpacity),
  );

  // TODO create styles for Alert/Content and Alert/Background
};
