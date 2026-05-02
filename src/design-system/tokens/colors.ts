export type ColorKey =
  | 'primary'
  | 'background'
  | 'surface'
  | 'text'
  | 'muted'
  | 'border'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
export type ColorPalette = Record<ColorKey, string>;

const lightColors: ColorPalette = {
  primary: '#D658B3',
  background: '#E9E7E9',
  surface: '#F4F1F2',
  text: '#4A4448',
  muted: '#756C71',
  border: '#DFDCDF',
  success: '#45B442',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#0969DA',
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
  info: '#388BFD',
};

export { lightColors, darkColors };
