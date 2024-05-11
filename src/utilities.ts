import { KaboomCtx } from "kaboom";
import { scale } from "./constants";

export async function makeMap(k: KaboomCtx, mapName: string) {
  const mapData = await (await fetch(`./maps/${mapName}.json`)).json();
  const map = k.make([
    k.sprite(mapName),
    k.scale(scale),
    k.pos(0, 0),
  ]);
  const spawnPoints: { [key: string]: {x: number, y: number} } = {};

  for (const layer of mapData.layers) {
    if (layer.name === "collider") {
      for (const collider of layer.objects) {
        k.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ["platform", "exit"],
          }),
          collider.name !== "exit" ? k.body({isStatic: true}) : null,
          k.pos(collider.x, collider.y),
          // give each collider a tag
          collider.name !== "exit" ? "platform" : "exit",
        ]);

      }
    }
  }
}