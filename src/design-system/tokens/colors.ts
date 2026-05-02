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
  surface: '#F6F8FA',
  text: '#1F2328',
  muted: '#636C76',
  border: '#D0D7DE',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
};

const darkColors: ColorPalette = {
  primary: '#0A84FF',
  background: '#0D1117',
  surface: '#161B22',
  text: '#E6EDF3',
  muted: '#8B949E',
  border: '#30363D',
  success: '#30D158',
  warning: '#FF9F0A',
  danger: '#FF453A',
};

export { lightColors, darkColors };
