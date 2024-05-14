import {
  KaboomCtx,
  GameObj,
  SpriteComp,
  AreaComp,
  BodyComp,
  DoubleJumpComp,
  HealthComp,
  OpacityComp,
  PosComp,
  ScaleComp,
} from "kaboom";
import { scale } from "./constants";

// create type
// taking default game object and adding custom components & properties
// (for typescript)
type PlayerGameObj = GameObj<
  SpriteComp &
    AreaComp &
    BodyComp &
    PosComp &
    ScaleComp &
    HealthComp &
    OpacityComp &
    DoubleJumpComp & {
      speed: number;
      direction: string;
      isInhaling: boolean;
      isFull: boolean;
    }
>;

// create player and enemy entities
export function makePlayer(k: KaboomCtx, posX: number, posY: number) {
  const player = k.make([
    k.sprite("assets", { anim: "kIdle" }),
    k.area({ shape: new k.Rect(k.vec2(4, 5.9), 8, 10) }),
    k.body(),
    k.pos(posX * scale, posY * scale),
    k.scale(scale),
    k.doubleJump(10),
    k.health(3),
    k.opacity(1),
    // can add object to player, making properties accessible e.g. player.speed
    // arbitrary properties, unique to the game
    {
      speed: 300,
      direction: "right",
      isInhaling: false,
      isFull: false,
    },
    // add tag, used later in collision logic
    "player",
  ]);

  player.onCollide("enemy", async (enemy: GameObj) => {
    if (player.isInhaling && enemy.isInhaleable) {
      // does there need to also be a check for if player is already full?
      player.isInhaling = false;
      // if player is inhaling and enemy is inhaleable, destroy enemy
      k.destroy(enemy);
      player.isFull = true;
      return;
    }
    if (player.hp() === 0) {
      // if player has no health, destroy player, reset game
      k.destroy(player);
      k.go("level1");
      return;
    }
    // if player can't inhale, but doesn't die, then player takes damage
    player.hurt();

    // add tween for flashing effect (when player takes damage)
    // using await so first tween completes before second starts
    await k.tween(
      player.opacity, // current value: 1
      0, // target value: 0
      0.05, // duration: 0.05s
      (value) => (player.opacity = value), // setter
      k.easings.linear // easing function, ie rate of change
    );
    await k.tween(
      player.opacity, // current value: 0
      1, // target value: 1
      0.05,
      (value) => (player.opacity = value),
      k.easings.linear
    );
  });
  player.onCollide("exit", () => {
    // if player touches exit, go to next level
    k.go("level2");
  });

  // animation for inhale -> always playing, but change opacity depending on player input
  const inhaleEffect = k.add([
    k.sprite("assets", { anim: "kInhaleEffect" }),
    k.pos(),
    k.scale(scale),
    k.opacity(0),
    "inhaleEffect", // tag
  ]);

  // create inhale area hit box
  const inhaleZone = k.add([
    k.area({ shape: new k.Rect(k.vec2(0, 0), 20, 4) }),
    k.pos(), // empty for now, need to know direction of player
    "inhaleZone", // tag
  ]);

  inhaleZone.onUpdate(() => {
    // onUpdate is a callback that runs every frame
    if (player.direction === "left") {
      inhaleZone.pos = k.vec2(-14, 8); // position of inhaleZone relative to player
      inhaleEffect.pos = k.vec2(player.pos.x - 60, player.pos.y + 0);
      inhaleEffect.flipX = true; // flip inhaleEffect sprite
      return;
    }
    inhaleZone.pos = k.vec2(14, 8);
    inhaleEffect.pos = k.vec2(player.pos.x + 60, player.pos.y + 0);
    inhaleEffect.flipX = false;
  });

  player.onUpdate(() => {
    if (player.pos.y > 2000) {
      // y value increases as player falls
      // if player falls off screen, reset game
      k.go("level1");
    }
  });

  return player;
}
export function setControls(k: KaboomCtx, player: PlayerGameObj) {
  // k.get is a function that returns an array of objects with a certain tag
  const inhaleEffectRef = k.get("inhaleEffect")[0];
  // k.onKeyDown is a function that gives you the key pressed, runs a callback
  k.onKeyDown((key) => {
    switch (key) {
      case "left":
        player.direction = "left";
        player.flipX = true;
        player.move(-player.speed, 0);
        break;
      case "right":
        player.direction = "right";
        player.flipX = false;
        player.move(player.speed, 0);
        break;
      case "z":
        if (player.isFull) {
          // if player is full, exhale
          player.play("kFull");
          inhaleEffectRef.opacity = 0;
          return;
        }
        player.isInhaling = true;
        player.play("kInhale");
        inhaleEffectRef.opacity = 1;
        break;
      default:
        break;
    }
  });
  k.onKeyPress("space", () => {
    player.doubleJump();
  });
  // good challenge - try to implement kirby's ability to imitate enemy / use their powers
  // e.g. if kirby inhales a fire enemy, kirby can shoot fire
  k.onKeyRelease("z", () => {
    if (player.isFull) {
      player.play("kInhale");
      const shootingStar = k.add([
        k.sprite("assets", { 
          anim: "shootingStar",
          flipX: !player.flipX, 
          // tutorial has flipX: player.direction === "right", evaluate to boolean
          // star sprite is originally facing left, e.g. flipX: true would make it face right
         }),
        k.area({ shape: new k.Rect(k.vec2(5, 4), 6, 6) }),
        k.pos(player.direction === "left" ? player.pos.x - 80 : player.pos.x + 80, player.pos.y + 5),
        k.scale(scale),
        player.direction === "left" ? k.move(k.LEFT, 800) : k.move(k.RIGHT, 800),
        "shootingStar",
      ]);
      shootingStar.onCollide("platform", () => k.destroy(shootingStar));

      player.isFull = false;
      k.wait(1, () => player.play("kIdle"));
    }
  });
}
