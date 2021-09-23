import { Theme } from '@mui/material/styles';
import { importPalette, exportPalette } from './palette';
import { setTypography, getTypography } from './typography';

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  const { type, payload } = msg;

  if (type === 'IMPORT_THEME') {
    const theme = payload as Theme;

    importPalette(theme.palette);

    const promises = [setTypography(theme.typography)];

    await Promise.all(promises);

    figma.notify('✅ Your custom MUI theme was imported successfully.');
  }

  if (type === 'EXPORT_THEME') {
    const theme = {
      palette: exportPalette(),
      typography: getTypography(),
    };

    figma.ui.postMessage({ id: 'MUI', value: theme });
  }

  figma.closePlugin();
};
