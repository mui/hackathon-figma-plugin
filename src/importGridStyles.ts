import { createStyleImporter } from "./createStyleImporter";
import type { Size } from "./types";

export const importGridStyles = createStyleImporter<Size, GridStyle>(
    figma.getLocalGridStyles,
    () => {},
  );