import Spring from './spring';
import SpringSystem from './spring-system';
import presets from './presets';

const funcsToProxy = [
  'setCurrentValue',
  'setEndValue',
  'setVelocity',
];

/**
 * A SpringGroup is a container of Springs, but inherits from Spring.
 * It is used to create a "chain" of Springs that follow each other naturally,
 * creating a physics-based staggered effect. The "chat heads" example uses SpringGroup
 * (demos/demo1).
 *
 * Since SpringGroup extends the basic Spring class, you can call any method on it
 * that you can a Spring, making using a SpringGroup identical to a single Spring,
 * except for a few options pertaining to how you'd like your SpringGroup to behave.
 */
export default class SpringGroup extends Spring {
  /**
   * Creates the SpringGroup. Usually, you should be using
   * the SpringSystem factory to create SpringGroups (and Springs),
   * so you probably shouldn't be calling this method directly.
   * @param  {Object} system    SpringSystem to attach to.
   * @param  {Function} getKeys Used to setup the Springs needed for this group.
   *                            This should return an array of names to identify
   *                            each spring by. The function is passed the `props`
   *                            object of your component, so that you can dynamically
   *                            create Springs as needed. For example, if your component
   *                            handles a list of posts, and is called with a `posts`
   *                            prop, your `getKeys` argument might look like:
   *                            (props) => props.posts.map((post) => post.id)
   *                            Which just returns an array of your post ids. A number
   *                            equal to posts.length of Springs will be created, with a
   *                            mapping to each post.id.
   * @param  {[type]} opts    Options to modify how SpringGroup behaves. Currently, there is
   *                          only one option available: `stagger`, which must be an integer
   *                          and is used to determine the direction the SpringGroup moves in.
   *                          For example, if stagger = -1, the SpringGroup will update the last
   *                          Spring in the group first, and move backwards (by 1). If stagger = 1,
   *                          then the SpringGroup will update the first Spring in the group first, then
   *                          the next one, etc.
   */
  constructor(system, getKeys, opts) {
    let res = super(system);
    opts = Object.assign({ stagger: 1 }, presets.default, opts);
    this.setSpringConfig(opts);
    this._getKeys = getKeys;
    this._springRegistry = {};

    return res;
  }

  updateSpringsForProps(props) {
    if (!this._getKeys) return console.error('Must provide a method to get Spring Keys in a SpringGroup');
    const keys = this._getKeys(props);

    // setup list of springs, keeping old springs if they exist,
    // discarding no longer used ones
    let newSprings = {};
    keys.forEach((key) => {
      if (this._springRegistry.hasOwnProperty(key)) {
        newSprings[key] = this._springRegistry[key];
      } else {
        newSprings[key] = new Spring(this, this.getSpringConfig());
      }
    });

    // now setup spring staggering / following
    const springKeys = Object.keys(newSprings);
    let springLeader;
    springKeys.forEach((key, i) => {
      if (newSprings.hasOwnProperty(key)) {
        const springToFollow = newSprings[springKeys[i - this._springConfig.stagger]];
        if (!springToFollow) springLeader = newSprings[key];
        if (springToFollow) newSprings[key].follow(springToFollow);
      }
    });

    this._springLeader = springLeader || newSprings[springKeys[0]];
    this._springRegistry = newSprings;
  }

  getCurrentValue() {
    // TODO: Building this array on every frame could get costly.
    // Perhaps we can cache these values instead of retrieving lazily.
    return Object.keys(this._springRegistry).map((key) => this._springRegistry[key].getCurrentValue());
  }

  getSpring(key) {
    return this._springRegistry[key];
  }

  systemShouldAdvance() {
    // TODO: optimizations can probably be done here
    return Object.keys(this._springRegistry).some((key) => {
      const spring = this._springRegistry[key];
      return spring && spring.systemShouldAdvance();
    });
  }

  advance() {
    const args = arguments;
    return Object.keys(this._springRegistry).forEach((key) => {
      const spring = this._springRegistry[key];
      return spring && spring.advance.apply(spring, args);
    });
  }

  getAllSprings() {
    return SpringSystem.prototype.getAllSprings.call(this);
  }

  activateSpring() {
    return this._springSystem.activateSpring(this._id);
  }

  deregisterSpring() {
    console.warn('deregisterSpring called! (todo)');
  }

  shouldForceSyncOps() {
    return this._springSystem.shouldForceSyncOps.apply(this._springSystem, arguments);
  }
}

funcsToProxy.forEach((property) => {
  SpringGroup.prototype[property] = function() {
    return this._springLeader ? this._springLeader[property].apply(this._springLeader, arguments) : undefined;
  };
});
