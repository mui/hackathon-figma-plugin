import { importTokens, parsePayload } from './importTokens';

figma.showUI(__html__);

figma.ui.onmessage = async (msg) => {
  const { type, payload } = msg;

  switch (type) {
    case 'IMPORT_THEME':
      const tokens = parsePayload(payload);
      const [status] = await importTokens(tokens, { categories: ['PAINT'] });

      if (status.success) {
        figma.notify(
          `✅ Successfully imported ${status.newStylesCount || 0} tokens. ${
            status.updatedStylesCount || 0
          } updated, ${status.newStylesCount - status.updatedStylesCount} new`,
        );
      } else {
        figma.notify('❌ Oops, something went wrong…');
      }
      break;
    case 'RESIZE':
      const { height, width } = payload;
      const { height: viewportHeight, width: viewportWidth } = figma.viewport.bounds;

      figma.ui.resize(Math.min(width, viewportWidth), Math.min(height, viewportHeight));

      return;
    case 'CANCEL':
    default:
      break;
  }

  figma.closePlugin();
};
