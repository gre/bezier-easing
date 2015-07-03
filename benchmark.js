var BezierEasing = require(".");
var Benchmark = require("benchmark");

var suite = new Benchmark.Suite();

var random = Math.random;

var bezier = BezierEasing([ 0.2, 0.3, 1.0, 0.5 ]);

suite
.add('BezierEasing: instanciation', function() {
  BezierEasing([ random(), random(), random(), random() ]);
})
.add('BezierEasing: call', function() {
  bezier.get(random());
})
.add('BezierEasing: instanciation + call', function() {
  var bezier = BezierEasing([ random(), random(), random(), random() ]);
  bezier.get(random());
})
// add listeners
.on('cycle', function(event) {
  var log = String(event.target);
  if (typeof document !== "undefined")
    document.body.innerHTML += "<p><code>"+log+"</code></p>";
  else
    console.log(log);
})
// run async
.run();
