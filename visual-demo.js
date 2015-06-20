var BezierEasing = require(".");

function create (n, w, lh, easing) {
  var els = [];
  var container = document.createElement("div");
  document.body.appendChild(container);
  container.style.width = w + "px";
  container.style.height = (n * lh) + "px";
  container.style.overflow = "hidden";
  container.style.background = "black";
  container.style.display = "inline-block";
  for (var i=0; i<n; ++i) {
    var el = document.createElement("div");
    el.style.width = w + "px";
    el.style.height = lh + "px";
    el.style.background = "hsl("+Math.floor(255*i/n)+",80%,50%)";
    container.appendChild(el);
    els.push(el);
  }
  return function (t) {
    for (var i=0; i<els.length; ++i) {
      var percent = easing((1 + Math.cos((t + i * 200) / 1500)) / 2);
      els[i].style.transform = "translateX("+(percent * 100)+"%)";
    }
  };
}

var w = 200;
var n = 100;
var lh = 6;
var renders = []
.concat(create(n, w, lh, BezierEasing(0.2, 0.3, 1.0, 0.2)))
.concat(create(n, w, lh, BezierEasing(0.1, 0.0, 1.0, 0.95)))
.concat(create(n, w, lh, BezierEasing(0.2, 1.0, 1.0, 1.0)))
.concat(create(n, w, lh, BezierEasing(0.8,0.5,0.0,0.8)))
.concat(create(n, w, lh, BezierEasing(0.16,1,0.7,0.0)))
.concat(create(n, w, lh, BezierEasing(0.03,0.9,0.2,0.46)));

requestAnimationFrame(function loop (t) {
  requestAnimationFrame(loop);

  for (var i=0; i<renders.length; ++i)
    renders[i](t);
});
