import {ThemeOptions, createTheme} from "@mui/material/styles";

const EXCLUDED_TYPOGRAPHY_KEYS = ['htmlFontSize', 'pxToRem', 'fontFamily', 'fontSize', 'fontWeightLight', 'fontWeightRegular', 'fontWeightMedium', 'fontWeightBold']

const isFunction = (func: any): func is Function => typeof func === 'function'

const defaultTheme = createTheme();

const convertCSSSizeToPixel = (fontSize: string | number): number => {
    if (typeof fontSize === 'number') {
        return fontSize
    }

    // TODO: Improve to handle custom rem ratios
    if (fontSize.endsWith('em')) {
        return (Number(fontSize.replace('rem', ''))) * 16
    }

    if (fontSize.endsWith('px')) {
        return Number(fontSize.replace('px', ''))
    }

    throw new Error(`The following size format is not handled by convertCSSSizeToPixel: ${fontSize}`)
}

const convertCSSLetterSpacing = (letterSpacing: string): LetterSpacing => {
    if (letterSpacing.endsWith('%')) {
        return {
            unit: "PERCENT",
            value: Number(letterSpacing.replace('%', ''))
        }
    }

    // TODO: Improve to handle custom em ratios
    if (letterSpacing.endsWith('em')) {
        return {
            unit: "PIXELS",
            value: Number(letterSpacing.replace('em', '')) * 16,
        }
    }

    if (letterSpacing.endsWith('px')) {
        return {
            unit: "PIXELS",
            value: Number(letterSpacing.replace('px', ''))
        }
    }

    throw new Error(`The following letter spacing format is not handled by convertCSSLetterSpacing: ${letterSpacing}`)
}

export const setTypography = async (typography: ThemeOptions['typography'] | undefined) => {
    if (!typography) {
        return
    }

    if (isFunction(typography)) {
        throw new Error('Function typography is not yet supported')
    }

    const figmaStyles = figma.getLocalTextStyles();

    // TODO Extract the font to load from the theme
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" })

    Object
        .entries(typography as any)
        .filter((el) => !EXCLUDED_TYPOGRAPHY_KEYS.includes(el[0]))
        .forEach(([key, inputValue]) => {
            const name = `typography/${key}`

            let figmaStyle = figmaStyles.find((style) => style.name === name);
            if (!figmaStyle) {
                figmaStyle = figma.createTextStyle();
                figmaStyle.name = name;
            }

            const value: any = { ...defaultTheme.typography[key] as any, ...inputValue as any }

            figmaStyle.fontSize = convertCSSSizeToPixel(value.fontSize)
            figmaStyle.letterSpacing = convertCSSLetterSpacing(value.letterSpacing)
            figmaStyle.fontName = value.font
        })
}

setTypography({
    "h1": {
        "fontFamily": "Roboto",
        "fontWeight": 300,
        "fontSize": "6rem",
        "lineHeight": 1.167,
        "letterSpacing": "-0.01562em"
    },
    "h2": {
        "fontSize": 20,
        "fontWeight": 600
    }
})