# bezier-easing

BezierEasing provides **Cubic Bezier** Curve easing which generalizes easing functions (ease-in, ease-out, ease-in-out, ...any other custom curve) exactly like in CSS Transitions.

Implementing efficient lookup is not easy because it implies projecting
the X coordinate to a Bezier Curve.
This micro library uses fast heuristics (involving dichotomic search, newton-raphson, sampling) to focus on **performance** and **precision**.

> It is heavily based on implementations available in Firefox and Chrome (for the CSS transition-timing-function property).

## Usage

```javascript
var easing = BezierEasing(0, 0, 1, 0.5);
// easing allows to project x in [0.0,1.0] range onto the bezier-curve defined by the 4 points (see schema below).
console.log(easing(0.0)); // 0.0
console.log(easing(0.5)); // 0.3125
console.log(easing(1.0)); // 1.0
// x outside [0.0,1.0] is clamped
console.log(easing(1.5)); // 1.0
```

(this schema is from the CSS spec)

[![TimingFunction.png](https://www.w3.org/TR/css-easing-1/images/cubic-bezier-easing-curve.svg)](https://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions)

> `BezierEasing(P1.x, P1.y, P2.x, P2.y)`

## Install

[![npm install bezier-easing](https://nodei.co/npm/bezier-easing.png)](https://npmjs.org/package/bezier-easing)

It is the equivalent to [CSS Transitions' `transition-timing-function`](http://www.w3.org/TR/css-easing-1/#cubic-bezier-easing-functions).

In the same way you can define in CSS `cubic-bezier(0.42, 0, 0.58, 1)`,
with BezierEasing, you can define it using `BezierEasing(0.42, 0, 0.58, 1)` which have the `` function taking an X and computing the Y interpolated easing value (see schema).

## License

MIT License.

## Tests

```
npm test
```

# See also

- [https://github.com/gre/bezier-easing-editor/](https://github.com/gre/bezier-easing-editor/)

# Who uses it?

bezier-easing, or a port of it, is embedded in many projects. Here are some of them:

**Animation**

- [React Native](https://github.com/facebook/react-native/blob/HEAD/packages/react-native/Libraries/Animated/bezier.js) (`Easing.bezier`)
- [React Native Web](https://github.com/necolas/react-native-web/blob/HEAD/packages/react-native-web/src/vendor/react-native/Animated/bezier.js)
- [React Native Reanimated](https://github.com/software-mansion/react-native-reanimated/blob/HEAD/packages/react-native-reanimated/src/Bezier.ts)
- [Motion](https://github.com/motiondivision/motion/blob/HEAD/packages/motion-utils/src/easing/cubic-bezier.ts) (Framer Motion, modified version)
- [Popmotion](https://github.com/Popmotion/popmotion/blob/HEAD/packages/popmotion/src/easing/cubic-bezier.ts)
- [lottie-web](https://github.com/airbnb/lottie-web/blob/HEAD/player/js/3rd_party/BezierEaser.js)
- [Velocity.js](https://github.com/julianshapiro/velocity/blob/HEAD/src/Velocity/easing/bezier.ts)
- [Animated](https://github.com/animatedjs/animated/blob/HEAD/src/bezier.js)
- [AntV G](https://github.com/antvis/G/blob/HEAD/packages/g/src/plugins/web-animations-api/utils/bezier-easing.ts)
- [Galacean Effects](https://github.com/galacean/effects-runtime/blob/HEAD/packages/effects-core/src/math/bezier.ts)
- [karas](https://github.com/karasjs/karas/blob/HEAD/src/animate/easing.js)
- [ipo](https://github.com/gre/ipo)

**UI and visualization**

- [Cytoscape.js](https://github.com/cytoscape/cytoscape.js/blob/HEAD/src/core/animation/cubic-bezier.mjs)
- [NG-ZORRO](https://github.com/NG-ZORRO/ng-zorro-antd/blob/HEAD/components/style/color/bezierEasing.cjs) (Ant Design color palette)
- [Leva](https://github.com/pmndrs/leva/blob/HEAD/packages/plugin-bezier/src/bezier-utils.ts)
- [React Figma](https://github.com/react-figma/react-figma/blob/HEAD/src/rn/Animated/bezier.ts)
- [React Desktop](https://github.com/gabrielbull/react-desktop/blob/HEAD/src/animation/bezierEasing.js)
- [Arco Design Mobile](https://github.com/arco-design/arco-design-mobile/blob/HEAD/packages/common-widgets/utils/bezier-easing.ts)
- [ngx-scrollbar](https://github.com/MurhafSousli/ngx-scrollbar/blob/HEAD/projects/ngx-scrollbar/smooth-scroll/src/bezier-easing.ts)
- [space.js](https://github.com/alienkitty/space.js/blob/HEAD/src/tween/BezierEasing.js)

**Ports to other languages**

- [fframes](https://github.com/dmtrKovalenko/fframes/blob/HEAD/fframes/src/animation/cubic_bezier.rs) (Rust)
- [keyframe](https://github.com/hannesmann/keyframe/blob/HEAD/src/functions/dynamic_functions.rs) (Rust)
- [ReactUnity](https://github.com/ReactUnity/core/blob/HEAD/unity/core/Runtime/Styling/Animations/TimingFunctions.cs) (C#)
- [Doodle](https://github.com/nacular/doodle/blob/HEAD/Animation/src/commonMain/kotlin/io/nacular/doodle/animation/transition/CubicBezier.kt) (Kotlin)
- [eepp](https://github.com/SpartanJ/eepp/blob/HEAD/src/eepp/math/easing.cpp) (C++)
- [QWidget-FancyUI](https://github.com/COLORREF/QWidget-FancyUI/blob/HEAD/src/Fancy/utils/BezierEasing.cpp) (C++/Qt)
- [Ceramic](https://github.com/ceramic-engine/ceramic/blob/HEAD/runtime/src/ceramic/BezierEasing.hx) (Haxe)
- [Starling](https://github.com/openfl/starling/blob/HEAD/src/starling/animation/BezierEasing.hx) (Haxe)

**Apps**

- [Apple®](https://www.apple.com/v/airpods-pro/t/built/scripts/overview/main.built.js) :)
- [eHunter](https://github.com/hanFengSan/eHunter/blob/HEAD/core/utils/bezier-easing.js)
- [One Last Image](https://github.com/itorr/one-last-image/blob/HEAD/html/bezier-easing.js)
- [InfiniPaint](https://github.com/ErrorAtLine0/infinipaint/blob/HEAD/include/Helpers/BezierEasing.cpp) (C++)
- [DS4Windows](https://github.com/CircumSpector/DS4Windows/blob/HEAD/Vapour.Shared.Common.Interfaces/Types/BezierCurve.cs) (C#)
- [Lyricon](https://github.com/tomakino/lyricon/blob/HEAD/lyric/view/src/main/kotlin/io/github/proify/lyricon/lyric/view/line/effect/EmphasizeGlowEffect.kt) (Kotlin)
- [petpet](https://github.com/Dituon/petpet/blob/HEAD/core/src/main/java/moe/dituon/petpet/core/utils/math/BezierEasing.java) (Java)
- [Three.cad](https://github.com/twpride/three.cad/blob/HEAD/extlib/cubicBezier.js)
- [Hack Club Blot](https://github.com/hackclub/blot/blob/HEAD/virtual-gallery/drawing-functions/bezierEasing.js)
- [Webaverse](https://github.com/webaverse/app/blob/HEAD/easing.js)

Using it somewhere? Feel free to open a PR to add your project.

## More informations

Implementation based on this [article](http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/).

## Contributing

You need a `node` installed.

Install the deps:

```
npm install
```

The library is in `src/index.js`.

Ensure any modification will:

- keep validating the tests (run `npm test`)
- not bring performance regression (compare with `npm run benchmark` – don't rely 100% on its precision but it still helps to notice big gaps)
