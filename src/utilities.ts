import { KaboomCtx } from "kaboom";
import { scale } from "./constants";

export async function makeMap(k: KaboomCtx, mapName: string) {
  const mapData = await (await fetch(`./${mapName}.json`)).json();
  const map = k.make([
    k.sprite(mapName),
    k.scale(scale),
    k.pos(0),
  ]); 
  const spawnPoints: { [key: string]: {x: number, y: number}[] } = {};

  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      for (const collider of layer.objects) {
        map.add([
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
      continue;
    }
    if (layer.name === "spawnpoints") {
      for (const spawnPoint of layer.objects) {
        if (spawnPoints[spawnPoint.name]) {
          // if the spawn point already exists, add to the array
          spawnPoints[spawnPoint.name].push({
            x: spawnPoint.x,
            y: spawnPoint.y,
          });
          continue;
        }
        // else, create the spawn point array
        spawnPoints[spawnPoint.name] = [{x: spawnPoint.x, y: spawnPoint.y}];
      }
    }
  }
  return { map, spawnPoints };
}