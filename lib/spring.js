import { Spring as ReboundSpring } from 'rebound';
import presets from './presets';

export default class Spring extends ReboundSpring {
  constructor(system, opts = {}) {
    super(system);

    opts = Object.assign({}, presets.default, opts);
    this.setSpringConfig(opts);
    this.setOvershootClampingEnabled(!!opts.overshootClamping);
  }

  // this needs to be over-written so that it 
  // can tap into SpringSystem's loop so we fire the proper 
  // "afterIntegration" callbacks on each position update
  setCurrentValue() {
    super(...arguments);
    if (!this._springSystem.shouldForceSyncOps()) {
      this._springSystem.activateSpring(this.getId());
    }
    return this;
  }

  follow(spring) {
    if (this._following) this._following.removeListener(this._onFollow); 
    this._following = spring.addListener({
      onSpringUpdate: this._onFollow.bind(this)
    });
  }

  _onFollow(spring) {
    this.setEndValue(spring.getCurrentValue());
  }
}