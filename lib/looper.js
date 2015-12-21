import raf from 'raf';

export default class AnimationLooper {
  constructor() {
    this.runs = [];
  }

  run(func) {
    this.runs.push(func);
    if (!this.isLooping) this.loop();
  }

  loop() {
    this.isLooping = true;
    raf(() => {
      const funcs = this.runs;
      this.runs = [];
      this.isLooping = false;

      // todo: is this right?
      funcs.forEach((func) => setTimeout(() => func(), 0));
    });
  }
}

export const globalLooper = new AnimationLooper();
