import { decomposeColor, Theme, alpha, createTheme } from '@mui/material/styles';
import { capitalize } from '@mui/material/utils';

const PALETTES = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
const SUPPORTED_KEYS = [...PALETTES, 'common', 'grey', 'text', 'divider', 'background', 'action'];

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
  if (!color) {
    return;
  }
  try {
    const { values: colorRgb } = decomposeColor(color);
    const [red, green, blue, opacity = 1] = colorRgb;
    style.paints = [
      { type: 'SOLID', color: { r: red / 255, g: green / 255, b: blue / 255 }, opacity },
    ];
  } catch (error) {
    console.log('error', error);
  }
};

export const importPalette = async (importedPalette: Theme['palette']) => {
  const resolvedTheme = createTheme({ palette: importedPalette });
  Object.entries(importedPalette).forEach(([name, value]) => {
    if (SUPPORTED_KEYS.indexOf(name) !== -1) {
      if (typeof value === 'string') {
        // eg. divider
        createPaintStyleWithColor([capitalize(name)], value);
      } else {
        Object.entries(value).forEach(([field, color]: [string, string]) => {
          const colorName = field === 'contrastText' ? 'contrast' : field;
          createPaintStyleWithColor([capitalize(name), capitalize(colorName)], color);
        });

        if (PALETTES.indexOf(name) !== -1) {
          createPaintStyleWithColor(
            [capitalize(name), 'States', 'Outlined Resting Border'],
            alpha(value.main, 0.5),
          );

          createPaintStyleWithColor(
            [capitalize(name), 'States', 'Contained Hover Background'],
            value.dark,
          );

          createPaintStyleWithColor(
            [capitalize(name), 'States', 'Outlined Hover Background'],
            alpha(value.main, resolvedTheme.palette.action.hoverOpacity),
          );
        }
      }

      // TODO create styles for Alert/Content and Alert/Background
    }
  });
};
