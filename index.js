(function (definition) {
  if (typeof exports === "object") {
    module.exports = definition();
  }
  else if (typeof window.define === 'function' && window.define.amd) {
    window.define([], definition);
  } else {
    window.BezierEasing = definition();
  }
}(function () {

  /**
  * BezierEasing - use bezier curve for transition easing function
  * is inspired from Firefox's nsSMILKeySpline.cpp
  * Usage:
  * var spline = new BezierEasing(0.25, 0.1, 0.25, 1.0)
  * spline(x) => returns the easing value | x must be in [0, 1] range
  */
  function BezierEasing (mX1, mY1, mX2, mY2) {
    if (!(this instanceof BezierEasing)) return new BezierEasing(mX1, mY1, mX2, mY2);

    // Validate arguments
    if (arguments.length !== 4) throw new Error("BezierEasing requires 4 arguments.");
    for (var i=0; i<4; ++i) {
      if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i]))
        throw new Error("BezierEasing arguments should be integers.");
    }
    if (mX1 < 0 || mX1 > 1 || mX2 < 0 || mX2 > 1) throw new Error("BezierEasing x values must be in [0, 1] range.");
   
    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1)      { return 3.0 * aA1; }
   
    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function CalcBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }
   
    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function GetSlope(aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }
   
    function GetTForX(aX) {
      // Newton raphson iteration
      var aGuessT = aX;
      for (var i = 0; i < 8; ++i) {
        var currentSlope = GetSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }

    // TODO: optimization to come: cache and pre-compute some samples for faster computation

    var f = function (aX) {
      if (mX1 === mY1 && mX2 === mY2) return aX; // linear
      return CalcBezier(GetTForX(aX), mY1, mY2);
    };
    var str = "BezierEasing("+[mX1, mY1, mX2, mY2]+")";
    f.toString = function () { return str; };
    return f;
  }

  // CSS mapping
  BezierEasing.css = {
    "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0), 
    "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
    "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
    "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
    "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
  };

  return BezierEasing;

}));
