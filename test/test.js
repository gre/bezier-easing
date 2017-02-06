
// test pull request!!


var BezierEasing = require("..");
var assert = require("assert");

var identity = function (x) { return x; };

function assertClose (a, b, message, precision) {
  if (!precision) precision = 0.000001;
  assert(Math.abs(a-b) < precision, message);
}

function makeAssertCloseWithPrecision (precision) {
  return function (a, b, message) {
    assertClose(a, b, message, precision);
  };
}

function allEquals (be1, be2, samples, assertion) {
  if (!assertion) assertion = assertClose;
  for (var i=0; i<=samples; ++i) {
    var x = i / samples;
    assertion(be1(x), be2(x), "comparing "+be1+" and "+be2+" for value "+x);
  }
}

function repeat (n) {
  return function (f) {
    for (var i=0; i<n; ++i) f(i);
  };
}

describe('BezierEasing', function(){
  it('should be a function', function(){
    assert.ok(typeof BezierEasing === "function");
  });
  it('should creates an object', function(){
    assert.ok(typeof BezierEasing(0, 0, 1, 1) === "function");
  });
  it('should fail with wrong arguments', function () {
    assert.throws(function () { BezierEasing(0.5, 0.5, -5, 0.5); });
    assert.throws(function () { BezierEasing(0.5, 0.5, 5, 0.5); });
    assert.throws(function () { BezierEasing(-2, 0.5, 0.5, 0.5); });
    assert.throws(function () { BezierEasing(2, 0.5, 0.5, 0.5); });
  });
  describe('linear curves', function () {
    it('should be linear', function () {
      allEquals(BezierEasing(0, 0, 1, 1), BezierEasing(1, 1, 0, 0), 100);
      allEquals(BezierEasing(0, 0, 1, 1), identity, 100);
    });
  });
  describe('common properties', function () {
    it('should be the right value at extremes', function () {
      repeat(1000)(function () {
        var a = Math.random(), b = 2*Math.random()-0.5, c = Math.random(), d = 2*Math.random()-0.5;
        var easing = BezierEasing(a, b, c, d);
        assert.equal(easing(0), 0, easing+"(0) should be 0.");
        assert.equal(easing(1), 1, easing+"(1) should be 1.");
      });
    });

    it('should approach the projected value of its x=y projected curve', function () {
      repeat(1000)(function () {
        var a = Math.random(), b = Math.random(), c = Math.random(), d = Math.random();
        var easing = BezierEasing(a, b, c, d);
        var projected = BezierEasing(b, a, d, c);
        var composed = function (x) { return projected(easing(x)); };
        allEquals(identity, composed, 100, makeAssertCloseWithPrecision(0.05));
      });
    });
  });
  describe('two same instances', function () {
    it('should be strictly equals', function () {
      repeat(100)(function () {
        var a = Math.random(), b = 2*Math.random()-0.5, c = Math.random(), d = 2*Math.random()-0.5;
        allEquals(BezierEasing(a, b, c, d), BezierEasing(a, b, c, d), 100, 0);
      });
    });
  });
  describe('symetric curves', function () {
    it('should have a central value y~=0.5 at x=0.5', function () {
      repeat(100)(function () {
        var a = Math.random(), b = 2*Math.random()-0.5, c = 1-a, d = 1-b;
        var easing = BezierEasing(a, b, c, d);
        assertClose(easing(0.5), 0.5, easing+"(0.5) should be 0.5");
      });
    });
    it('should be symetrical', function () {
      repeat(100)(function () {
        var a = Math.random(), b = 2*Math.random()-0.5, c = 1-a, d = 1-b;
        var easing = BezierEasing(a, b, c, d);
        var sym = function (x) { return 1 - easing(1-x); };
        allEquals(easing, sym, 100);
      });
    });
  });
});
