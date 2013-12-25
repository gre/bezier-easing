bezier-easing [![Build Status](https://travis-ci.org/gre/bezier-easing.png)](https://travis-ci.org/gre/bezier-easing)
===

BezierEasing provides interpolation to make Bezier Curve based easing functions for your JavaScript animations.

[![npm install bezier-easing](https://nodei.co/npm/bezier-easing.png?mini=true)](http://npmjs.org/package/bezier-easing)

It is the equivalent to [CSS Transitions' `transition-timing-function`](http://www.w3.org/TR/css3-transitions/#transition-timing-function-property).

See this schema from the CSS spec:

[![TimingFunction.png](http://www.w3.org/TR/css3-transitions/TimingFunction.png)](http://www.w3.org/TR/css3-transitions/#transition-timing-function-property)

In CSS you can define easing with `cubic-bezier(0.42, 0, 0.58, 1)`, 
with BezierEasing, you can define it using `BezierEasing(0.42, 0, 0.58, 1)` which retuns a function taking an X and computing the Y interpolated easing value (see the schema).

**Example:**

[See it for real here](http://greweb.me/bezier-easing/example).

```javscript
var canvas = document.getElementById("viewport"), ctx = canvas.getContext("2d");

animate(moveRectangle, 2000, BezierEasing(0.25, 0.1, 0.0, 1.0));

function moveRectangle (p) { // p move from 0 to 1
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "hsl("+Math.round(255*p)+",80%,50%)";
  var w = 50;
  var h = 50 + p * (canvas.height - 50);
  ctx.fillRect((canvas.width-w) * p, (canvas.height-h)*0.5, w, h);
}

function animate (render, duration, easing) {
  var start = Date.now();
  (function loop () {
    var p = (Date.now()-start)/duration;
    if (p > 1) {
      render(1);
    }
    else {
      requestAnimationFrame(loop);
      render(easing(p));
    }
  }());
}
```

Predefined BezierEasing functions
---

We have defined for you all existing CSS `transition-timing-function` :

```javscript
BezierEasing.css = {
  "ease":        BezierEasing(0.25, 0.1, 0.25, 1.0), 
  "linear":      BezierEasing(0.00, 0.0, 1.00, 1.0),
  "ease-in":     BezierEasing(0.42, 0.0, 1.00, 1.0),
  "ease-out":    BezierEasing(0.00, 0.0, 0.58, 1.0),
  "ease-in-out": BezierEasing(0.42, 0.0, 0.58, 1.0)
};
```

Perfect if you want for instance to make an abstraction on top of CSS and JavaScript animations.

Who use it?
===

- [Apple®](http://images.apple.com/v/mac-pro/home/b/scripts/overview.js) :)

More informations
===

Implementation based on this [article](http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/).

