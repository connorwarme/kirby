import { k } from "./kaboomCtx";
import { makeMap } from "./utilities";
import {
  makeBirdEnemy,
  makeFlameEnemy,
  makeGuyEnemy,
  makePlayer,
  setControls,
} from "./entities";
import { globalGameState } from "./state";

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
  k.loadSprite("level-intro", "./level-intro.png");
  k.loadSprite("level0", "./level0.png");
  k.loadSprite("level1", "./level1.png");
  k.loadSprite("level2", "./level2.png");
  k.loadSprite("level3", "./level3.png");

  // rename map and spawnPoints to differentiate each level
  const { map: levelIntroMap, spawnPoints: levelIntroSpawnPoints } = await makeMap(k, "level-intro");
  const { map: level0Map, spawnPoints: level0SpawnPoints } = await makeMap(
    k,
    "level0"
  );
  const { map: level1Map, spawnPoints: level1SpawnPoints } = await makeMap(
    k,
    "level1"
  );
  const { map: level2Map, spawnPoints: level2SpawnPoints } = await makeMap(
    k,
    "level2"
  );
  const { map: level3Map, spawnPoints: level3SpawnPoints } = await makeMap(
    k,
    "level3"
  );
  k.scene("level-intro", () => {
    globalGameState.setCurrentScene("level-intro");
    globalGameState.setNextScene("level0");
    k.setGravity(2100);
    k.add([k.rect(k.width(), k.height()), k.color(247, 215, 219), k.fixed()]);
    k.add(levelIntroMap);
    const kirby = makePlayer(
      k,
      levelIntroSpawnPoints.player[0].x,
      levelIntroSpawnPoints.player[0].y
    );
    setControls(k, kirby);
    k.add(kirby);
    k.camScale(k.vec2(0.7)); // also could be k.camScale(0.7, 0.7)
    k.onUpdate(() => {
      if (kirby.pos.x < levelIntroMap.pos.x + 432) {
        k.camPos(kirby.pos.x + 500, 870); // sets kirby up on left side of screen, so user can see what's coming
      }
    });
  });
  k.scene("level0", () => {
    globalGameState.setCurrentScene("level0");
    globalGameState.setNextScene("level1");
    k.setGravity(2100);
    k.add([k.rect(k.width(), k.height()), k.color(247, 215, 219), k.fixed()]);
    k.add(level0Map);
    const kirby = makePlayer(
      k,
      level0SpawnPoints.player[0].x,
      level0SpawnPoints.player[0].y
    );
    setControls(k, kirby);
    k.add(kirby);
    k.camScale(k.vec2(0.5)); // also could be k.camScale(0.7, 0.7)
    k.onUpdate(() => {
      if (kirby.pos.x < level0Map.pos.x + 432) {
        k.camPos(kirby.pos.x + 500, 870); // sets kirby up on left side of screen, so user can see what's coming
      }
    });
    for (const flame of level0SpawnPoints.flame) {
      makeFlameEnemy(k, flame.x, flame.y);
    }
    for (const guy of level0SpawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }
    for (const bird of level0SpawnPoints.bird) {
      const speeds = [100, 150, 200, 250, 300];
      k.loop(7, () => {
        const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];
        makeBirdEnemy(k, bird.x, bird.y, randomSpeed);
      });
    }
  });
  // scene logic for level1
  k.scene("level1", () => {
    globalGameState.setCurrentScene("level1");
    globalGameState.setNextScene("level2");
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
    k.camScale(k.vec2(0.5)); // also could be k.camScale(0.7, 0.7)
    k.onUpdate(() => {
      if (kirby.pos.x < level1Map.pos.x + 432) {
        k.camPos(kirby.pos.x + 500, 870); // sets kirby up on left side of screen, so user can see what's coming
      }
    });
    for (const flame of level1SpawnPoints.flame) {
      makeFlameEnemy(k, flame.x, flame.y);
    }
    for (const guy of level1SpawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }
    for (const bird of level1SpawnPoints.bird) {
      makeBirdEnemy(k, bird.x, bird.y, 100);
    }
  });
  k.scene("level2", () => {
    globalGameState.setCurrentScene("level2");
    globalGameState.setNextScene("level3");
    k.setGravity(2100);
    k.add([k.rect(k.width(), k.height()), k.color(247, 215, 219), k.fixed()]);
    k.add(level2Map);
    const kirby = makePlayer(
      k,
      level2SpawnPoints.player[0].x,
      level2SpawnPoints.player[0].y
    );
    setControls(k, kirby);
    k.add(kirby);
    k.camScale(k.vec2(0.7)); // also could be k.camScale(0.7, 0.7)
    k.onUpdate(() => {
      if (kirby.pos.x < level2Map.pos.x + 432) {
        k.camPos(kirby.pos.x + 500, 870); // sets kirby up on left side of screen, so user can see what's coming
      }
    });
    for (const flame of level2SpawnPoints.flame) {
      makeFlameEnemy(k, flame.x, flame.y);
    }
    for (const guy of level2SpawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }
    for (const bird of level2SpawnPoints.bird) {
      makeBirdEnemy(k, bird.x, bird.y, 100);
    }
  });
  k.scene("level3", () => {
    globalGameState.setCurrentScene("level3");
    globalGameState.setNextScene("end");
    k.setGravity(2100);
    k.add([k.rect(k.width(), k.height()), k.color(247, 215, 219), k.fixed()]);
    k.add(level3Map);
    const kirby = makePlayer(
      k,
      level3SpawnPoints.player[0].x,
      level3SpawnPoints.player[0].y
    );
    setControls(k, kirby);
    k.add(kirby);
    k.camScale(k.vec2(0.7)); // also could be k.camScale(0.7, 0.7)
    k.onUpdate(() => {
      if (kirby.pos.x < level3Map.pos.x + 432) {
        k.camPos(kirby.pos.x + 500, 870); // sets kirby up on left side of screen, so user can see what's coming
      }
    });
    for (const flame of level3SpawnPoints.flame) {
      makeFlameEnemy(k, flame.x, flame.y);
    }
    for (const guy of level3SpawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }
  });

  k.go("level-intro");
}

gameSetup();
