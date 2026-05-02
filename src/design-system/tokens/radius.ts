const radius = {
  sm: 4,
  md: 8,
  lg: 16,
} as const;

export type RadiusKey = keyof typeof radius;
export type Radius = typeof radius;

export default radius;
