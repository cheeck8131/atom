import "./events";
import "./commands";
import "./race";

export const newVector = (v: { x: number; y: number; z: number }) =>
  new mp.Vector3(v.x, v.y, v.z);
