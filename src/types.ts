import type { DesignToken } from 'style-dictionary';

export type DesignTokensByType = {
  [k in StyleType]?: DesignToken[];
};

export function isDesignToken(obj: any): obj is DesignToken {
  return obj?.value !== undefined;
}

export interface Color extends DesignToken {
  name: string;
  value: RGBA;
  attributes: {
    category: 'color';
  };
}

export function isColor(obj: any): obj is Color {
  return obj?.attributes?.category === 'color';
}

export interface Size extends DesignToken {
  name: string;
  value: string;
  attributes: {
    category: 'size';
  };
}

export function isSize(obj: any): obj is Size {
  return obj?.attributes?.category === 'size';
}

export type ImportPromise = Promise<{
  success: boolean;
  newStylesCount?: number;
  preexistingStylesCount?: number;
  updatedStylesCount?: number;
}>;
