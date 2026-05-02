export type ColorKey =
  | 'primary'
  | 'background'
  | 'surface'
  | 'text'
  | 'muted'
  | 'border'
  | 'success'
  | 'warning'
  | 'danger';
export type ColorPalette = Record<ColorKey, string>;

const lightColors: ColorPalette = {
  primary: '#007AFF',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  muted: '#8E8E93',
  border: '#C6C6C8',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
};

const darkColors: ColorPalette = {
  primary: '#0A84FF',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  muted: '#8E8E93',
  border: '#38383A',
  success: '#30D158',
  warning: '#FF9F0A',
  danger: '#FF453A',
};

export { lightColors, darkColors };
