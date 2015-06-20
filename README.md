bezier-easing [![Build Status](https://travis-ci.org/gre/bezier-easing.png)](https://travis-ci.org/gre/bezier-easing)
===

BezierEasing provides interpolation to make Bezier Curve based easing functions for your JavaScript animations.

Usage
-------

```javascript
var easing = BezierEasing(0, 0, 1, 0.5);
// easing is a function which projects x in [0.0, 1.0] onto the bezier-curve defined by the 4 points (see schema below).
console.log(easing(0.0)); // 0.0
console.log(easing(0.5)); // 0.3125
console.log(easing(1.0)); // 1.0
```

(this schema is from the CSS spec)

[![TimingFunction.png](http://www.w3.org/TR/css3-transitions/TimingFunction.png)](http://www.w3.org/TR/css3-transitions/#transition-timing-function-property)

Install
-------

[![npm install bezier-easing](https://nodei.co/npm/bezier-easing.png)](http://npmjs.org/package/bezier-easing)

It is the equivalent to [CSS Transitions' `transition-timing-function`](http://www.w3.org/TR/css3-transitions/#transition-timing-function-property).


In the same way you can define in CSS `cubic-bezier(0.42, 0, 0.58, 1)`, 
with BezierEasing, you can define it using `BezierEasing(0.42, 0, 0.58, 1)` which retuns a function taking an X and computing the Y interpolated easing value (see schema).


Example:
-------

* [See glsl-transition example](http://greweb.me/glsl-transition/).

Predefined BezierEasing functions
---

**bezier-easing** also define a mapping from existing CSS `transition-timing-function` :

```javscript
BezierEasing.css = {
  "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0), 
  "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
  "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
  "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
  "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
};
```

License
-------

MIT License.

Tests
---

[![Build Status](https://travis-ci.org/gre/bezier-easing.png)](https://travis-ci.org/gre/bezier-easing)

```
npm test
```

See also
===

- [https://github.com/gre/bezier-easing-editor/](https://github.com/gre/bezier-easing-editor/)

Who use it?
===

- [Apple®](http://images.apple.com/v/mac-pro/home/b/scripts/overview.js) :)
- [Velocity.js](https://github.com/julianshapiro/velocity)
- [GLSL.io](http://glsl.io/) and [Diaporama Maker](https://github.com/gre/diaporama-maker)

More informations
-----------------

Implementation based on this [article](http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/).

Contributing
------------

You need a `node` installed.

Install the deps:

```
npm install
```

The library is in `index.js`.

Ensure any modication will: 
- keep validating the tests (run `npm test`)
- not bring performance regression (compare with `node benchmark.js` – don't rely 100% on its precision but it still helps to notice big gaps)
- Run the visual example: `npm run visual`
