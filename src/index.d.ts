/**
 * Creates a Cubic Bezier Curve easing function.
 *
 * @param mX1 - The x coordinate of the first control point (must be in range [0, 1]).
 * @param mY1 - The y coordinate of the first control point.
 * @param mX2 - The x coordinate of the second control point (must be in range [0, 1]).
 * @param mY2 - The y coordinate of the second control point.
 * @returns An easing function that takes x (in [0, 1], clamped otherwise) and returns the eased value.
 * @throws Will throw an error if x values are not in the range [0, 1].
 */
export default function bezier(
  mX1: number,
  mY1: number,
  mX2: number,
  mY2: number
): (x: number) => number;
