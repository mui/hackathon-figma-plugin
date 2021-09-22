import { decomposeColor } from '@mui/material/styles';

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  const { type, payload } = msg;

  if (type === 'IMPORT_THEME') {
    const style = findOrCreateStyle('Primary/Main');
    const paletteColor = decomposeColor(payload.palette.primary.main);
    const [red, green, blue] = paletteColor.values;
    style.paints = [{ type: 'SOLID', color: { r: red / 255, g: green / 255, b: blue / 255 } }];
  }

  figma.closePlugin();
};

const findOrCreateStyle = (name: string) => {
  const allStyles = figma.getLocalPaintStyles();
  let style = allStyles.find((style) => style.name === name);
  if (!style) {
    style = figma.createPaintStyle();
    style.name = name;
  }
  return style;
};
