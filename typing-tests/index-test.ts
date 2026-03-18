import bezier from "../src/index";
import type { EasingFunction } from "../src/index";

const easingFunction: EasingFunction = bezier(1, 1, 1, 1);
const result = easingFunction(0);
