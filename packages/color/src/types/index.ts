/** 颜色调色板编号，主色编号为 500 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** 颜色调色板 */
export type ColorPalette = {
  hex: string;
  number: ColorPaletteNumber;
};

/** 颜色调色板系列 */
export type ColorPaletteFamily = {
  name: string;
  palettes: ColorPalette[];
};

/** 颜色调色板索引 (1-11，6 为主色) */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
