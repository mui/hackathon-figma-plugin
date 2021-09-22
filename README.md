## MVP

### Required

- [ ] able to import a [partial theme](https://mui.com/customization/default-theme/#main-content) (json) and change palette & typography.
  - [ ] palette @siriwatknp
  - [ ] typography @flaviendelangle
- [ ] able to export colors & typography from figma into json file.
- [ ] import auxiliary color groups (e.g. action, text, background).
- [ ] add "Export" button in https://mui.com/customization/color/#playground

### Features

- [ ] allow replace or override option when importing theme to figma @flaviendelangle

## Development

### HMR (Hot module replacement)

- `brew install modd`
- run `chmod +x applescript.sh` in the root project dir
- run `yarn dev`
- open the plugin in Figma
- try changing code in `src/ui.tsx`
