import kaboom from "kaboom";
import { scale } from "./constants";

export const k = kaboom({
  // scale serves as workaround for kaboom issue where pixels aren't always sized properly/evenly
  width: 256 * scale,
  height: 144 * scale,
  scale,
  // letterbox helps with scaling, keeps aspect ratio
  letterbox: true,
  // only want to use kaboom constants via k
  global: false
});