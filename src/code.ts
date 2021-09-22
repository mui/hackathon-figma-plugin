import {decomposeColor, SimplePaletteColorOptions, ThemeOptions} from '@mui/material/styles';

const isFunction = (func: any): func is Function => typeof func === 'function'

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  const { type, payload } = msg;

  if (type === 'IMPORT_THEME') {
    const theme = payload as ThemeOptions

    setPalette(theme.palette)
    setTypography(theme.typography)
  }

  figma.closePlugin();
};

const setPalette = (palette: ThemeOptions['palette'] | undefined) => {
  if (!palette) {
    return
  }

  const style = findOrCreatePaintStyle('Primary/Main');
  // TODO Handle ColorPartial format
  const paletteColor = decomposeColor((palette.primary as SimplePaletteColorOptions).main);
  const [red, green, blue] = paletteColor.values;
  style.paints = [{ type: 'SOLID', color: { r: red / 255, g: green / 255, b: blue / 255 } }];
}

const setTypography = (typography: ThemeOptions['typography'] | undefined) => {
  if (!typography) {
    return
  }

  if (isFunction(typography)) {
    throw new Error('Function typography is not yet supported')
  }
}

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
