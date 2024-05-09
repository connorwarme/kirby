import { k } from "./kaboomCtx";

async function gameSetup() {
  // load assets
  k.loadSprite("assets", "kirby-sprites.png", {
    sliceX: 8,
    sliceY: 9,
    anims: {
      kIdle: 0,
      kInhale: 1,
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
        loop: true
      },
      guyIdle: 18,
      guyRun: {
        from: 18,
        to: 19,
        speed: 4,
        loop: true
      },
      bird: {
        from: 27,
        to: 28,
        speed: 4,
        loop: true
      }
    }    
  })
  k.add([
    k.rect(k.width(), k.height()),
    k.color(247, 215, 219),
    k.fixed(),
  ])
  k.loadSprite("level1", "./level1.png");
  // k.scene("level1", () => {
  //   k.setGravity(2100);
  //   k.add([
  //     k.rect(k.width(), k.height()),
  //     k.color(247, 215, 219),
  //     k.fixed(),
  //   ])
  // })
}

gameSetup()