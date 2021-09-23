import { Theme } from '@mui/material/styles';
import { importPalette } from './palette';
import { setTypography } from './typography';

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
    // TODO: replace the value with figma palette & typography
    figma.ui.postMessage({ id: 'MUI', value: { palette: { primary: { main: '#ff5252' } } } });
  }

  // figma.closePlugin();
};
