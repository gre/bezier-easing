export interface EasingFunction {
  (input: number): number;
}

declare function bezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): EasingFunction;

export default bezier;
