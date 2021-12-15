import { Theme } from '@mui/material/styles';
import { importPalette } from './palette';

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  const { type, payload } = msg;

  switch (type) {
    case 'IMPORT_THEME':
      const theme = payload as Theme;

      importPalette(theme.palette);

      figma.notify('✅ Your custom MUI theme was imported successfully.');

    default:
      break;
  }

  figma.closePlugin();
};
