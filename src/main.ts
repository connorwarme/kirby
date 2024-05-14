import { k } from "./kaboomCtx";
import { makeMap } from "./utilities";
import { makePlayer, setControls } from "./entities";

async function gameSetup() {
  // load assets
  k.loadSprite("assets", "kirby-sprites.png", {
    sliceX: 9,
    sliceY: 10,
    anims: {
      kIdle: 0,
      kInhaling: 1,
      kFull: 2,
      kInhaleEffect: {
        from: 3,
        to: 8,
        speed: 15,
        loop: true,
      },
      shootingStar: 9,
      flame: {
        from: 36,
        to: 37,
        speed: 4,
        loop: true,
      },
      guyIdle: 18,
      guyWalk: {
        from: 18,
        to: 19,
        speed: 4,
        loop: true,
      },
      bird: {
        from: 27,
        to: 28,
        speed: 4,
        loop: true,
      },
    },
  });
  k.loadSprite("level1", "./level1.png");

  k.add([k.rect(k.width(), k.height()), k.color(247, 215, 219), k.fixed()]);

  // rename map and spawnPoints to differentiate each level
  const { map: level1Map, spawnPoints: level1SpawnPoints } = await makeMap(
    k,
    "level1"
  );

  k.scene("level1", () => {
    k.setGravity(2100);
    k.add([k.rect(k.width(), k.height()), k.color(247, 215, 219), k.fixed()]);
    k.add(level1Map);

    const kirby = makePlayer(
      k,
      level1SpawnPoints.player[0].x,
      level1SpawnPoints.player[0].y
    );
    setControls(k, kirby);
    k.add(kirby);

    // set up camera view
    // don't fully understand the nuance of this setup
    k.camScale(k.vec2(0.7)); // also could be k.camScale(0.7, 0.7)
    k.onUpdate(() => {
      if (kirby.pos.x < level1Map.pos.x + 432) {
        k.camPos(kirby.pos.x + 500, 800); // sets kirby up on left side of screen, so user can see what's coming
      }
    });
  });

  k.go("level1");
}

gameSetup();
