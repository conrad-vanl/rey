import Spring from './spring';
import SpringSystem from './spring-system';
import presets from './presets';

const funcsToProxy = [
  'setCurrentValue',
  'setEndValue',
  'setVelocity'
];

export default class SpringGroup extends Spring {
  constructor(system, getKeys, opts) {
    let res = super(system);
    opts = Object.assign({ stagger: 1 }, presets.default, opts);
    this.setSpringConfig(opts);
    this._getKeys = getKeys;
    this._springRegistry = {};

    return res;
  }

  updateSpringsForProps(props) {
    if (!this._getKeys) return console.error('Most provide a method to get Spring Keys in a SpringGroup');
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
        const springToFollow = newSprings[springKeys[i - this._springConfig['stagger']]];
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
  }
});