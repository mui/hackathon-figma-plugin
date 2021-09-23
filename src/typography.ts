import { capitalize } from '@mui/material/utils';
import { ThemeOptions, createTheme } from '@mui/material/styles';

export interface FontStyle
  extends Required<{
    fontFamily: React.CSSProperties['fontFamily'];
    fontSize: number;
    fontWeightLight: React.CSSProperties['fontWeight'];
    fontWeightRegular: React.CSSProperties['fontWeight'];
    fontWeightMedium: React.CSSProperties['fontWeight'];
    fontWeightBold: React.CSSProperties['fontWeight'];
    letterSpacing: string;
    fontWeight: string | number;
    htmlFontSize: number;
  }> {}

const isFunction = (func: any): func is Function => typeof func === 'function';

const convertCSSSizeToPixel = (fontSize: string | number): number => {
  if (typeof fontSize === 'number') {
    return fontSize;
  }

  // TODO: Improve to handle custom rem ratios
  if (fontSize.endsWith('em')) {
    return Number(fontSize.replace('rem', '')) * 16;
  }

  if (fontSize.endsWith('px')) {
    return Number(fontSize.replace('px', ''));
  }

  throw new Error(`The following size format is not handled by convertCSSSizeToPixel: ${fontSize}`);
};

const convertCSSLetterSpacing = (letterSpacing: string): LetterSpacing => {
  if (letterSpacing.endsWith('%')) {
    return {
      unit: 'PERCENT',
      value: Number(letterSpacing.replace('%', '')),
    };
  }

  // TODO: Improve to handle custom em ratios
  if (letterSpacing.endsWith('em')) {
    return {
      unit: 'PIXELS',
      value: Number(letterSpacing.replace('em', '')) * 16,
    };
  }

  if (letterSpacing.endsWith('px')) {
    return {
      unit: 'PIXELS',
      value: Number(letterSpacing.replace('px', '')),
    };
  }

  throw new Error(
    `The following letter spacing format is not handled by convertCSSLetterSpacing: ${letterSpacing}`,
  );
};

const WEIGHT_MAPPING = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

const TYPOGRAPHY = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'button',
  'caption',
  'overline',
];

export const setTypography = async (typography: ThemeOptions['typography'] | undefined) => {
  if (!typography) {
    return;
  }

  if (isFunction(typography)) {
    throw new Error('Function typography is not yet supported');
  }

  // TODO Extract the font to load from the theme
  await Promise.all([
    figma.loadFontAsync({ family: typography.fontFamily || 'Roboto', style: 'Light' }),
    figma.loadFontAsync({ family: typography.fontFamily || 'Roboto', style: 'Regular' }),
    figma.loadFontAsync({ family: typography.fontFamily || 'Roboto', style: 'Medium' }),
    figma.loadFontAsync({ family: typography.fontFamily || 'Roboto', style: 'Bold' }),
  ]);

  const figmaStyles = figma.getLocalTextStyles();

  Object.entries(typography as any).forEach(([key, inputValue]: [string, FontStyle]) => {
    if (TYPOGRAPHY.indexOf(key) !== -1) {
      const name = `Typography/${capitalize(key)}`;

      let figmaStyle = figmaStyles.find((style) => style.name === name);
      if (figmaStyle) {
        // figmaStyle = figma.createTextStyle();
        const font = { ...typography, ...inputValue };

        // fontFamily need to come first, otherwise font size does not have effect.
        if (font.fontFamily) {
          figmaStyle.fontName = {
            family: font.fontFamily,
            style: font.fontWeight
              ? (typeof font.fontWeight === 'number'
                  ? WEIGHT_MAPPING[font.fontWeight]
                  : font.fontWeight) || 'Regular'
              : figmaStyle.fontName.style,
          };
        }

        if (font.fontSize) {
          figmaStyle.fontSize = convertCSSSizeToPixel(font.fontSize);
        }
        if (font.letterSpacing) {
          figmaStyle.letterSpacing = convertCSSLetterSpacing(font.letterSpacing);
        }
      }
    }
  });
};

export const getTypography = () => {
  const figmaStyles = figma.getLocalTextStyles();

  const exportedStyles = TYPOGRAPHY.map((key) => ({
    key,
    value: figmaStyles.find((style) => style.name === `Typography/${capitalize(key)}`),
  }))
    .filter((style): style is { key: string; value: TextStyle } => !!style.value)
    .map(({ value, key }) => {
      const exportedStyle: any = {};

      if (value.letterSpacing != null) {
        if (value.letterSpacing.unit === 'PIXELS') {
          exportedStyle.letterSpacing = `${value.letterSpacing.value}px`;
        } else {
          exportedStyle.letterSpacing = `${value.letterSpacing.value}%`;
        }
      }

      if (value.fontSize != null) {
        exportedStyle.fontSize = `${value.fontSize}px`;
      }

      if (value.fontName != null) {
        const matchingWeight = Object.entries(WEIGHT_MAPPING).find(
          (weight) => weight[1] === value.fontName.style,
        );
        if (matchingWeight != null) {
          exportedStyle.fontWeight = Number(matchingWeight[0]);
        }
        exportedStyle.fontFamily = value.fontName.family;
      }

      return [key, exportedStyle];
    });

  return Object.fromEntries(exportedStyles);
};
