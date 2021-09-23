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

export const importPalette = (importedPalette: Theme['palette']) => {
  const resolvedTheme = createTheme({ palette: importedPalette });
  Object.entries(importedPalette).forEach(([name, value]) => {
    if (SUPPORTED_KEYS.indexOf(name) !== -1) {
      if (typeof value === 'string') {
        // eg. divider
        createPaintStyleWithColor([capitalize(name)], value);
      } else {
        Object.entries(value).forEach(([field, color]: [string, string | number]) => {
          const colorName = field === 'contrastText' ? 'contrast' : field;
          if (typeof color === 'string') {
            createPaintStyleWithColor([capitalize(name), capitalize(colorName)], color);
          }
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

function assignValueDeep(target, keys, value) {
  let temp = target;
  keys.forEach((k, index) => {
    if (index === keys.length - 1 && value) {
      temp[k] = value;
    } else {
      if (!temp[k]) {
        temp[k] = {};
      }
      temp = temp[k];
    }
  });
}

function getPaintColor(paintStyle: Paint | undefined) {
  if (paintStyle) {
    if (paintStyle.type === 'SOLID') {
      const { color, opacity } = paintStyle;
      // rgb color is in 0-1 scale
      return `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(
        color.b * 255,
      )}, ${opacity < 1 && opacity > 0 ? opacity.toFixed(2) : opacity})`;
    }
  }
  return undefined;
}

export const exportPalette = () => {
  const paintStyles = figma.getLocalPaintStyles();
  const palette = {};
  paintStyles.forEach((paint) => {
    let keys = paint.name.split('/').map((k) => k.toLowerCase()); // pick only 2 levels

    if (SUPPORTED_KEYS.indexOf(keys[0]) !== -1 && keys.length <= 2) {
      assignValueDeep(palette, keys, getPaintColor(paint.paints[0]));
    }
  });

  return palette;
};
