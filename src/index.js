/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 *
 * Algebraic solver by Dmitry Baranovskiy
 * http://dmitry.baranovskiy.com/bezier-easing.html
 */

function LinearEasing(x) {
  return x;
}

const { min, max, cbrt, sqrt, acos, cos } = Math;

// Solve x(t) = ((2a * t + 3b) * t + 3c) * t = x for t in [0, 1].
// With u = 1/t, u is the largest real root of x·u³ − 3c·u² − 3b·u − 2a = 0
// (t is the only root in (0, 1] since x(t) is monotonic). Unlike solving for t,
// nothing is divided by the cubic coefficient a, so it stays stable when x(t) is
// (nearly) quadratic, and small t are computed with full relative precision.
// Depressed with u = v + s: v³ − 3m·v + 2h = 0
const x2t = (x, a, b, c) => {
  const i = 1 / x;
  const s = c * i;
  const q = b * i;
  const m = s * s + q;
  const h = -s * (s * s + 1.5 * q) - a * i;
  const D = h * h - m * m * m;
  let v;
  if (D > 0) {
    // one real root (Cardano), taking the cube root that does not cancel
    const U = -cbrt(h < 0 ? h - sqrt(D) : h + sqrt(D));
    v = U + m / U;
  } else {
    // three real roots, take the largest (|| 0: triple root, m = h = 0)
    const r = sqrt(m);
    v = 2 * r * cos(acos(max(-1, min(1, -h / (m * r) || 0))) / 3);
  }
  // || 0: x so small (< 1e-307) that 1/x overflows
  return min(1, 1 / (v + s)) || 0;
};

const Y = (t, ay, by, cy) => ((ay * t + by) * t + cy) * t;

export default function bezier(mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error("bezier x values must be in [0, 1] range");
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  const a = (3 * mX1 - 3 * mX2 + 1) / 2;
  const b = mX2 - 2 * mX1;
  const c = mX1;

  const ay = 3 * mY1 - 3 * mY2 + 1;
  const by = 3 * (mY2 - 2 * mY1);
  const cy = 3 * mY1;

  return function BezierEasing(x) {
    if (x === 0 || x === 1) {
      return x;
    }
    return Y(x2t(x, a, b, c), ay, by, cy);
  };
}
