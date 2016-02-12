import raf from 'raf';

/**
 * Simple animation looper that is used by Rey to provide
 * a single request-animation-frame event loop for all spring updates.
 */
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
