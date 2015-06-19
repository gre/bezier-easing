var BezierEasing = require(".");
var Benchmark = require("benchmark");

var suite = new Benchmark.Suite();

var random = Math.random;

var bezier = BezierEasing(0.2, 0.3, 1.0, 0.5);

suite
.add('BezierEasing: instanciations', function() {
  for (var i=0; i<1000; i++) {
    BezierEasing(random(), random(), random(), random());
  }
})
.add('BezierEasing: calls', function() {
  for (var i=0; i<1000; i++) {
    bezier(random());
  }
})
.add('BezierEasing: instanciations & calls', function() {
  for (var i=0; i<100; i++) {
    var bezier = BezierEasing(random(), random(), random(), random());
    for (var j=0; j<10; j++) {
      bezier(random());
    }
  }
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
// run async
.run();
