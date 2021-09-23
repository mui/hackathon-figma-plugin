import { Theme } from '@mui/material/styles';
import { capitalize } from '@mui/material/utils';
import { importPaletteColor } from './import';
import { setTypography } from './typography';

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  const { type, payload } = msg;

  if (type === 'IMPORT_THEME') {
    // 1. turn theme into array, so that we can iterate and map the styles in figma
    // ex. { palette: { primary: { main: '#ff5252' }}} => [{ figmaName: 'palette/primary/main', value: '#ff5252' }]

    // 2. get localPaintStyles https://www.figma.com/plugin-docs/api/figma/#getlocalpaintstyles

    // 3. for each paint style in figma, find the color from (1) and apply the new color

    // Do the same for text styles
    const theme = payload as Theme;

    const promises = [setTypography(theme.typography)];

    Object.entries(theme.palette).forEach(([key, value]) => {
      // TODO add user defined type guard
      if (typeof value === 'object' && value.main) {
        importPaletteColor(key, value, theme);
      }
    });

    await Promise.all(promises);

    figma.notify('✅ Your custom MUI theme was imported successfully.');
  }

  // figma.closePlugin();
};

const readPalette = (palette: Theme['palette']) => {
  const result: Array<{ figmaName: string; value: string }> = [];

  function iterateDeepObject(object, parentKeys = []) {
    Object.entries(object).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result.push({ figmaName: [...parentKeys, capitalize(key)].join('/'), value });
      }
      if (typeof value !== null && typeof value === 'object') {
        iterateDeepObject(value, [...parentKeys, capitalize(key)]);
      }
    });
  }

  iterateDeepObject(palette);

  return result;
};
