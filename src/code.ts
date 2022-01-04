import { importPalette } from './palette';

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  const { type, payload } = msg;

  switch (type) {
    case 'IMPORT_THEME':
      const status = await importPalette(payload);
      if (status.success) {
        figma.notify(
          `✅ Successfully imported ${status.newStylesCount || 0} tokens. ${
            status.updatedStylesCount || 0
          } updated, ${status.newStylesCount - status.updatedStylesCount} new`,
        );
      } else {
        figma.notify('❌ Oops, something went wrong…');
      }
    default:
      break;
  }

  figma.closePlugin();
};
