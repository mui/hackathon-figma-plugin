import { decomposeColor } from '@mui/material/styles';

figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  const { type, payload } = msg;

  if (type === 'IMPORT_THEME') {
    // 1. turn theme into array, so that we can iterate and map the styles in figma
    // ex. { palette: { primary: { main: '#ff5252' }}} => [{ figmaName: 'palette/primary/main', value: '#ff5252' }]

    // 2. get localPaintStyles https://www.figma.com/plugin-docs/api/figma/#getlocalpaintstyles

    // 3. for each paint style in figma, find the color from (1) and apply the new color

    // Do the same for text styles

    const style = findOrCreateStyle('Primary/Main');
    const paletteColor = decomposeColor(payload.palette.primary.main);
    const [red, green, blue] = paletteColor.values;
    style.paints = [{ type: 'SOLID', color: { r: red / 255, g: green / 255, b: blue / 255 } }];
  }

  // figma.closePlugin();
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
