import {decomposeColor, Theme, ThemeOptions} from '@mui/material/styles';
import {capitalize} from '@mui/material/utils';

const isFunction = (func: any): func is Function => typeof func === 'function';

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  const { type, payload } = msg;

  if (type === 'IMPORT_THEME') {
    // 1. turn theme into array, so that we can iterate and map the styles in figma
    // ex. { palette: { primary: { main: '#ff5252' }}} => [{ figmaName: 'palette/primary/main', value: '#ff5252' }]

    // 2. get localPaintStyles https://www.figma.com/plugin-docs/api/figma/#getlocalpaintstyles

    // 3. for each paint style in figma, find the color from (1) and apply the new color

    // Do the same for text styles
    const theme = payload as Theme

    setPalette(theme.palette);
    setTypography(theme.typography);
  }

  // figma.closePlugin();
};

const setPalette = (palette: Theme['palette'] | undefined) => {
  if (!palette) {
    return
  }

  const flattenPalettes = readPalette(palette)

  flattenPalettes.forEach(palette => {
    const style = findOrCreatePaintStyle(palette.figmaName);
    const paletteColor = decomposeColor(palette.value);
    const [red, green, blue, opacity = 1] = paletteColor.values;
    style.paints = [{ type: 'SOLID', color: { r: red / 255, g: green / 255, b: blue / 255 }, opacity }];
  })
}

const setTypography = (typography: ThemeOptions['typography'] | undefined) => {
  if (!typography) {
    return;
  }

  if (isFunction(typography)) {
    throw new Error('Function typography is not yet supported');
  }
};

const findOrCreatePaintStyle = (name: string) => {
  const allStyles = figma.getLocalPaintStyles();
  let style = allStyles.find((style) => style.name === name);
  if (!style) {
    style = figma.createPaintStyle();
    style.name = name;
  }
  return style;
};

const findOrCreateTextStyle = (name: string) => {
  const allStyles = figma.getLocalTextStyles();
  let style = allStyles.find((style) => style.name === name);
  if (!style) {
    style = figma.createTextStyle();
    style.name = name;
  }
  return style;
};


const readPalette = (palette: Theme['palette']) => {
  const result: Array<{ figmaName: string; value: string }> = [];

  function iterateDeepObject(object, parentKeys = []) {
    Object.entries(object).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result.push({ figmaName: [...parentKeys, capitalize(key)].join('/'), value })
      }
      if (typeof value !== null && typeof value === 'object') {
        iterateDeepObject(value, [...parentKeys, capitalize(key)])
      }
    });
  }

  iterateDeepObject(palette);

  return result;
};
