import {
  SpringSystem as ReboundSpringSystem,
} from 'rebound';

import Spring from './spring';
import SpringGroup from './spring-group';
import { globalLooper } from './looper';


// Modified version of Rebound's SpringSystem that
// shares a global animation loop
export default class SpringSystem extends ReboundSpringSystem {
  constructor() {
    const looper = Object.create({
      run: () => globalLooper.run(() => this.loop(Date.now())),
    });
    super(looper);
  }

  // Need to use our own Spring class.
  /**
   * Create a Spring
   * @param  {Object} opts Options for Spring:
   * @param  {number} opts.tension
   * @param  {number} opts.friction
   * @param  {booolean} opts.overshootClamping Enable overshoot clamping
   * @return {Spring}
   */
  createSpring(opts = {}) {
    let spring = new Spring(this, opts);
    this.registerSpring(spring);
    return spring;
  }

  /**
   * Create a group of Springs that follow one another
   * ...gets recalculated when props changes
   */
  createSpringGroup(keys, opts = {}) {
    let group = new SpringGroup(this, keys, opts);
    this.registerSpring(group);
    return group;
  }

  // for now, we just need to loop through spring groups
  // and inform them of a prop update
  triggerPropUpdate(newProps) {
    this.getAllSprings().forEach((spring) => {
      if (spring && spring.updateSpringsForProps) spring.updateSpringsForProps(newProps);
    });
  }

  createSpringWithConfig() {
    this.createSpring(...arguments);
  }

  forceSyncOps(isit = true) {
    this._forceSyncOps = isit;
  }

  shouldForceSyncOps() {
    return this._forceSyncOps;
  }

  setLooper() {
    console.error('Not allowed to alter a SpringSystem\'s Looper');
  }
}
