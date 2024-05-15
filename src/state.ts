export const globalGameState: {
  scenes: string[];
  nextScene: string;
  currentScene: string;
  setNextScene: (sceneName: string) => void;
  setCurrentScene: (sceneName: string) => void;
} = {
  scenes: ["level0", "level1", "level2", "level3", "end"],
  nextScene: "",
  currentScene: "level0",
  setCurrentScene(sceneName: string) {
    if (this.scenes.includes(sceneName)) {
      this.currentScene = sceneName;
    }
  },
  setNextScene(sceneName: string) {
    if (this.scenes.includes(sceneName)) {
      this.nextScene = sceneName;
    }
  },
};