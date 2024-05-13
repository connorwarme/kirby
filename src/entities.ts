import { KaboomCtx, GameObj } from "kaboom";
import { scale } from "./constants";

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
  ])

  player.onCollide("enemy", async (enemy: GameObj) => {
    if (player.isInhaling && enemy.isInhaleable) { // does there need to also be a check for if player is already full?
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
      (value) => player.opacity = value, // setter
      k.easings.linear // easing function, ie rate of change
    )
    await k.tween(
      player.opacity, // current value: 0
      1, // target value: 1
      0.05, 
      (value) => player.opacity = value,
      k.easings.linear
    )
  });
  player.onCollide("exit", () => {
    // if player touches exit, go to next level
    k.go("level2");
  })

  // animation for inhale -> always playing, but change opacity depending on player input
  const inhaleEffect = k.add([
    k.sprite("assets", { anim: "kInhaleEffect" }),
    k.pos(),
    k.scale(scale),
    k.opacity(0),
    "inhaleEffect", // tag
  ])
}