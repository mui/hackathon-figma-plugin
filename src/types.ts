import type { DesignToken } from 'style-dictionary';

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
