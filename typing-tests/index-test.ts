import * as bezier from '../src/index';

const easingFunction: bezier.EasingFunction = bezier(1, 1, 1, 1);
const result = easingFunction(0);

