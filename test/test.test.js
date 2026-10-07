import { describe, it, expect } from "vitest";
import BezierEasing from "..";

var identity = function (x) {
  return x;
};

function assertClose(a, b, message, precision) {
  if (!precision) precision = 0.000001;
  expect(Math.abs(a - b), message).toBeLessThan(precision);
}

function makeAssertCloseWithPrecision(precision) {
  return function (a, b, message) {
    assertClose(a, b, message, precision);
  };
}

function allEquals(be1, be2, samples, assertion) {
  if (!assertion) assertion = assertClose;
  for (var i = 0; i <= samples; ++i) {
    var x = i / samples;
    assertion(
      be1(x),
      be2(x),
      "comparing " + be1 + " and " + be2 + " for value " + x
    );
  }
}

function repeat(n) {
  return function (f) {
    for (var i = 0; i < n; ++i) f(i);
  };
}

describe("BezierEasing", function () {
  it("should be a function", function () {
    expect(typeof BezierEasing).toBe("function");
  });
  it("should creates an object", function () {
    expect(typeof BezierEasing(0, 0, 1, 1)).toBe("function");
  });
  it("should fail with wrong arguments", function () {
    expect(function () {
      BezierEasing(0.5, 0.5, -5, 0.5);
    }).toThrow();
    expect(function () {
      BezierEasing(0.5, 0.5, 5, 0.5);
    }).toThrow();
    expect(function () {
      BezierEasing(-2, 0.5, 0.5, 0.5);
    }).toThrow();
    expect(function () {
      BezierEasing(2, 0.5, 0.5, 0.5);
    }).toThrow();
  });
  describe("linear curves", function () {
    it("should be linear", function () {
      allEquals(BezierEasing(0, 0, 1, 1), BezierEasing(1, 1, 0, 0), 100);
      allEquals(BezierEasing(0, 0, 1, 1), identity, 100);
    });
  });
  describe("common properties", function () {
    it("should be the right value at extremes", function () {
      repeat(1000)(function () {
        var a = Math.random(),
          b = 2 * Math.random() - 0.5,
          c = Math.random(),
          d = 2 * Math.random() - 0.5;
        var easing = BezierEasing(a, b, c, d);
        expect(easing(0)).toBe(0);
        expect(easing(1)).toBe(1);
      });
    });

    it("should approach the projected value of its x=y projected curve", function () {
      repeat(1000)(function () {
        var a = Math.random(),
          b = Math.random(),
          c = Math.random(),
          d = Math.random();
        var easing = BezierEasing(a, b, c, d);
        var projected = BezierEasing(b, a, d, c);
        var composed = function (x) {
          return projected(easing(x));
        };
        allEquals(identity, composed, 100, makeAssertCloseWithPrecision(0.05));
      });
    });
  });
  describe("two same instances", function () {
    it("should be strictly equals", function () {
      repeat(100)(function () {
        var a = Math.random(),
          b = 2 * Math.random() - 0.5,
          c = Math.random(),
          d = 2 * Math.random() - 0.5;
        allEquals(BezierEasing(a, b, c, d), BezierEasing(a, b, c, d), 100, 0);
      });
    });
  });
  describe("symetric curves", function () {
    it("should have a central value y~=0.5 at x=0.5", function () {
      repeat(100)(function () {
        var a = Math.random(),
          b = 2 * Math.random() - 0.5,
          c = 1 - a,
          d = 1 - b;
        var easing = BezierEasing(a, b, c, d);
        assertClose(easing(0.5), 0.5, easing + "(0.5) should be 0.5", 0.0005);
      });
    });
    it("should be symetrical", function () {
      repeat(100)(function () {
        var a = Math.random(),
          b = 2 * Math.random() - 0.5,
          c = 1 - a,
          d = 1 - b;
        var easing = BezierEasing(a, b, c, d);
        var sym = function (x) {
          return 1 - easing(1 - x);
        };
        allEquals(easing, sym, 100);
      });
    });
  });

  // With y1 = 1/3 and y2 = 2/3, y(t) = t: the easing returns the curve parameter t
  // solved for x, which allows checking the x → t solver directly.
  describe("curve parameter solver", function () {
    it("should find the t in [0, 1] solving x(t) = x, even at extreme x", function () {
      forEachCurve(controlXPairs(), function (x1, x2) {
        var solve = BezierEasing(x1, 1 / 3, x2, 2 / 3);
        allXs.forEach(function (x) {
          var t = solve(x);
          var expected = referenceT(x1, x2, x);
          // A zero slope away from t = 0 makes t ill-conditioned (x has absolute precision only)
          var illConditioned =
            bezierSlope(expected, x1, x2) < 1e-3 && expected > 1e-3;
          var precision = illConditioned ? 1e-5 : 1e-9;
          if (!(t >= 0 && t <= 1 && Math.abs(t - expected) < precision)) {
            fail(
              [x1, 1 / 3, x2, 2 / 3],
              x,
              "t = " + t + ", expected " + expected
            );
          }
        });
      });
    });
    it("should be monotonic", function () {
      forEachCurve(controlXPairs(), function (x1, x2) {
        var solve = BezierEasing(x1, 1 / 3, x2, 2 / 3);
        var prev = 0;
        allXs.forEach(function (x) {
          var t = solve(x);
          if (!(t >= prev - 1e-12)) {
            fail([x1, 1 / 3, x2, 2 / 3], x, "t = " + t + " after " + prev);
          }
          prev = t;
        });
      });
    });
    // x2 = 1 makes t = 1 a double root of x(t) = 1 (and x1 = 0 does for t = 0):
    // close to it, the cubic has two nearly equal roots
    it("should pick the right root next to a double root", function () {
      var x2s = [1, 1 - 1e-15, 1 - 1e-12, 1 - 1e-9, 1 - 1e-6, 1 - 1e-3];
      var xs = [
        1 - Number.EPSILON / 2,
        1 - Number.EPSILON,
        1 - 1e-15,
        1 - 1e-12,
      ];
      for (var i = 0; i <= 240; ++i) {
        var x1 = i / 240;
        x2s.forEach(function (x2) {
          // the curve and its symmetric (t → 1 - t), near t = 0
          [
            [x1, x2, xs],
            [1 - x2, 1 - x1, xs.map((x) => 1 - x)],
          ].forEach(function (c) {
            var solve = BezierEasing(c[0], 1 / 3, c[1], 2 / 3);
            c[2].forEach(function (x) {
              var t = solve(x);
              var expected = referenceT(c[0], c[1], x);
              if (!(t >= 0 && t <= 1 && Math.abs(t - expected) < 1e-5)) {
                fail(
                  [c[0], 1 / 3, c[1], 2 / 3],
                  x,
                  "t = " + t + ", expected " + expected
                );
              }
            });
          });
        });
      }
    });
    it("should keep finite, monotonic results down to the smallest x", function () {
      var xs = [];
      for (var e = -16; e >= -323; --e) xs.push(Math.pow(10, e));
      xs.push(Number.MIN_VALUE);
      forEachCurve(controlXPairs(), function (x1, x2) {
        var solve = BezierEasing(x1, 1 / 3, x2, 2 / 3);
        var prev = 1;
        xs.forEach(function (x) {
          var t = solve(x);
          if (!(t >= 0 && t <= prev)) {
            fail([x1, 1 / 3, x2, 2 / 3], x, "t = " + t + " after " + prev);
          }
          prev = t;
        });
      });
    });
    it("should keep relative precision for tiny x", function () {
      // for x → 0, x(t) ≈ 3·x1·t, or 3·x2·t² when x1 = 0, or t³ when x1 = x2 = 0
      var expectations = [];
      [1e-3, 0.25, 0.5, 1].forEach(function (x1) {
        [0, 0.5, 1].forEach(function (x2) {
          expectations.push([x1, x2, (x) => x / (3 * x1)]);
        });
      });
      [1e-3, 0.25, 1].forEach(function (x2) {
        expectations.push([0, x2, (x) => Math.sqrt(x / (3 * x2))]);
      });
      expectations.push([0, 0, Math.cbrt]);
      expectations.forEach(function (e) {
        var solve = BezierEasing(e[0], 1 / 3, e[1], 2 / 3);
        TINY_XS.forEach(function (x) {
          var t = solve(x);
          var expected = e[2](x);
          if (!(Math.abs(t - expected) <= 1e-9 * expected)) {
            fail(
              [e[0], 1 / 3, e[1], 2 / 3],
              x,
              "t = " + t + ", expected " + expected
            );
          }
        });
      });
    });
  });

  describe("precision against a reference solver", function () {
    it("should match the reference for well-known curves", function () {
      [
        [0.25, 0.1, 0.25, 1], // ease
        [0.42, 0, 1, 1], // ease-in
        [0, 0, 0.58, 1], // ease-out
        [0.42, 0, 0.58, 1], // ease-in-out
        [0.68, -0.6, 0.32, 1.6], // overshoot
        [0.5, 0, 0.5, 1],
        [0, 0.5, 0, 0.5],
        [1, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 1],
        [1, 0, 1, 0],
        [1 / 3, 0, 2 / 3, 1],
      ].forEach(function (p) {
        expectMatchesReference(p, 1e-9);
      });
    });
    it("should match the reference for random curves", function () {
      var random = seededRandom(1);
      for (var i = 0; i < 1000; ++i) {
        expectMatchesReference(
          [random(), 3 * random() - 1, random(), 3 * random() - 1],
          1e-9
        );
      }
    });
  });

  // x(t) has no cubic term when x2 - x1 = 1/3: x(t) is then quadratic in t
  describe("degenerate cubic curves (x2 = x1 + 1/3)", function () {
    it("should solve the quadratic case exactly", function () {
      // x(t) = t², so t = √x
      var easing = BezierEasing(0, 0, 1 / 3, 1);
      assertClose(easing(0.25), 0.5, "(0, 0, 1/3, 1)(0.25)", 1e-12);
      // y(t) = 3t² - 2t³ with t = √0.5
      assertClose(
        easing(0.5),
        1.5 - Math.SQRT1_2,
        "(0, 0, 1/3, 1)(0.5)",
        1e-12
      );
    });
    it("should match the reference for all x1", function () {
      for (var i = 0; i <= 200; ++i) {
        var x1 = (i / 200) * (2 / 3);
        var x2 = Math.min(1, x1 + 1 / 3);
        expectMatchesReference([x1, 0, x2, 1], 1e-9);
        expectMatchesReference([x1, 0.3, x2, 0.9], 1e-9);
        expectMatchesReference([x1, -0.6, x2, 1.6], 1e-9);
      }
    });
    it("should match the reference when close to degenerate", function () {
      [1e-15, 1e-12, 1e-9, 1e-7, 1e-5, 1e-4, 1e-3, 1e-2].forEach(
        function (eps) {
          [-eps, eps].forEach(function (delta) {
            for (var i = 0; i <= 20; ++i) {
              var x1 = (i / 20) * (2 / 3);
              var x2 = x1 + 1 / 3 + delta;
              if (x2 < 0 || x2 > 1) continue;
              expectMatchesReference([x1, 0, x2, 1], 1e-9);
            }
          });
        }
      );
    });
  });

  describe("x outside [0, 1]", function () {
    var curves = [
      [0.25, 0.1, 0.25, 1],
      [0, 0, 1, 1.0001],
      [0.68, -0.6, 0.32, 1.6],
      [0, 0, 1 / 3, 1],
      [0, 0, 1, 1], // linear
    ];
    it("should clamp x to [0, 1]", function () {
      curves.forEach(function (p) {
        var easing = BezierEasing(p[0], p[1], p[2], p[3]);
        [-1e-17, -Number.MIN_VALUE, -0.5, -1, -Infinity].forEach(function (x) {
          expect(easing(x), "BezierEasing(" + p + ")(" + x + ")").toBe(0);
        });
        [1 + Number.EPSILON, 1.5, 2, Infinity].forEach(function (x) {
          expect(easing(x), "BezierEasing(" + p + ")(" + x + ")").toBe(1);
        });
      });
    });
    it("should return NaN for NaN", function () {
      curves.forEach(function (p) {
        expect(BezierEasing(p[0], p[1], p[2], p[3])(NaN)).toBeNaN();
      });
    });
  });

  describe("output range", function () {
    it("should stay in [0, 1] and be monotonic when y1, y2 are in [0, 1]", function () {
      var random = seededRandom(2);
      var curves = [];
      for (var i = 0; i < 200; ++i) {
        curves.push([random(), random(), random(), random()]);
      }
      controlXPairs().forEach(function (x) {
        curves.push([x[0], 0, x[1], 1]);
        curves.push([x[0], 0.2, x[1], 0.8]);
      });
      curves.forEach(function (p) {
        var easing = BezierEasing(p[0], p[1], p[2], p[3]);
        var prev = 0;
        allXs.forEach(function (x) {
          var y = easing(x);
          // tolerate floating point rounding of y(t) near the bounds
          if (!(y >= -1e-12 && y <= 1 + 1e-12 && y >= prev - 1e-9)) {
            fail(p, x, "y = " + y + " after " + prev);
          }
          prev = y;
        });
      });
    });
  });
});

// Deterministic pseudo-random generator (Park-Miller) for reproducible failures
function seededRandom(seed) {
  return function () {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

var gridXs = [];
for (var gi = 1; gi < 200; ++gi) gridXs.push(gi / 200);
// x small enough for higher order terms of x(t) to be negligible
var TINY_XS = [1e-30, 1e-50, 1e-100, 1e-200, 1e-300];

var extremeXs = [
  1 - Number.EPSILON / 2,
  1 - Number.EPSILON,
  1e-15,
  1e-12,
  1e-9,
  1e-6,
  1 - 1e-6,
  1 - 1e-9,
  1 - 1e-12,
  1 - 1e-15,
];
var allXs = extremeXs.concat(gridXs).sort(function (a, b) {
  return a - b;
});

// x1, x2 control points covering the [0, 1]² grid, its edges, and the degenerate x2 = x1 + 1/3 band
function controlXPairs() {
  var values = [0, 1e-9, 1e-6, 1e-3, 1 / 3, 2 / 3, 1 - 1e-6, 1 - 1e-9, 1];
  for (var i = 0; i <= 20; ++i) values.push(i / 20);
  var pairs = [];
  values.forEach(function (x1) {
    values.forEach(function (x2) {
      pairs.push([x1, x2]);
    });
  });
  [0, 1e-15, 1e-12, 1e-9, 1e-6, 1e-4, 1e-3, 1e-2].forEach(function (eps) {
    [-eps, eps].forEach(function (delta) {
      for (var i = 0; i <= 30; ++i) {
        var x1 = (i / 30) * (2 / 3);
        var x2 = x1 + 1 / 3 + delta;
        if (x2 >= 0 && x2 <= 1) pairs.push([x1, x2]);
      }
    });
  });
  var random = seededRandom(3);
  for (var r = 0; r < 300; ++r) pairs.push([random(), random()]);
  return pairs;
}

function forEachCurve(pairs, f) {
  pairs.forEach(function (p) {
    // (1/3, 1/3, 2/3, 2/3) is short-circuited as linear
    if (p[0] === 1 / 3 && p[1] === 2 / 3) return;
    f(p[0], p[1]);
  });
}

function fail(p, x, message) {
  expect.fail("BezierEasing(" + p + ")(" + x + "): " + message);
}

function bezierX(t, x1, x2) {
  var u = 1 - t;
  return 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t;
}

function bezierSlope(t, x1, x2) {
  var u = 1 - t;
  return 3 * u * u * x1 + 6 * u * t * (x2 - x1) + 3 * t * t * (1 - x2);
}

// Reference x → t by bisection, x(t) being monotonic on [0, 1]
function referenceT(x1, x2, x) {
  var lo = 0,
    hi = 1;
  for (var i = 0; i < 100; ++i) {
    var mid = (lo + hi) / 2;
    if (bezierX(mid, x1, x2) < x) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function expectMatchesReference(p, precision) {
  var easing = BezierEasing(p[0], p[1], p[2], p[3]);
  for (var i = 1; i < 100; ++i) {
    var x = i / 100;
    var y = easing(x);
    var expected = bezierX(referenceT(p[0], p[2], x), p[1], p[3]);
    if (!(Math.abs(y - expected) < precision)) {
      fail(p, x, "y = " + y + ", expected " + expected);
    }
  }
}
