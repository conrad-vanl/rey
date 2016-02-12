import React from 'react';
import SpringSystem from './spring-system';

/**
 * Use this decorator to add Rey to your React Component. By default, this decorator will
 * define two props in the component:
 * - `transitionState`:    an object with key-value pairs for the current Springs and their position
 *                         This can be overwritten - see the `getTransitionState` @param below.
 * - `setTransitionState`: a function that you can use to update your Springs. It requires a
 *                         function as its only argument, which is immediately called with one argument -
 *                         an object with key-value pairs of spring instances
 * @param  {function} getSprings           Called when component class is constructured,
 *                                         use to define Springs that are needed. Function must return
 *                                         an object with the keys as your Spring names and
 *                                         the values as your Spring instancs. Function is passed
 *                                         a single argument - a SpringSystem instance that you can
 *                                         use as a factory for creating Springs (and SpringGroups).
 *                                         Ex:
 *                                         (springs) => { mySpring: springs.createSpring() }
 * @param  {function} defaultTransitionState Optioanl. Function that is called on mount and can be used to initialize
 *                                           your springs at default/initial values. Is passed an object containing
 *                                           key-value pairs of the current spring objects
 * @param  {function} getTransitionState   Optional. Function that is called when your spring values have
 *                                         updated. It must return an object, which is passed directly to the props on your
 *                                         component. It is called with one argument - an object containing key-value
 *                                         pairs of your springs and their current postion.
 *                                         By default, Rey simply passes this object back, but wrapped in another
 *                                         object with a single key - 'transitionState' - which is how
 *                                         `this.props.transitionState` is set within your component. If you provide
 *                                         a function here, this can be overwritten. For example, if you don't
 *                                         like (or can't use)  `transitionState` as the prop name, you can change it:
 *                                         (springState) => { myAlternativePropName: springState }
 *
 *                                         Another common use-case would be if you wanted to mutate the spring
 *                                         values outside of the context of your component. A contrived example:
 *                                         (springs) => {
 *                                           style: {
 *                                             opacity: springs.position / 100,
 *                                             y: springs.position + '%'
 *                                           }
 *                                         }
 * @return {Function}
 */
export default function(getSprings, defaultTransitionState, getTransitionState) {
  if (!getTransitionState || typeof getTransitionState !== 'function') {
    getTransitionState = (transitionState) => ({ transitionState });
  }

  return function decorator(Component) {
    return class Composition extends React.Component {
      constructor() {
        super(...arguments);

        this._callbacks = [];
        this._springSystem = new SpringSystem();
        this._springs = getSprings(this._springSystem);
        this._springSystem.addListener({ onAfterIntegrate: this.handleSpringSystemUpdate.bind(this) });

        // set initial state -
        this._springSystem.forceSyncOps(true); // can prevent an extra re-render if we're only doing `spring.setCurrentValue`
        this._springSystem.triggerPropUpdate(this.props || {});
        defaultTransitionState(this._springs);
        this.state = this.getTransitionState();
        this._springSystem.forceSyncOps(false);
      }

      componentWillReceiveProps(nextProps) {
        this._springSystem.triggerPropUpdate(nextProps);
      }

      setTransitionState(transitionState, callback) {
        if (callback) this._callbacks.push(callback);
        transitionState(this._springs);
        if (callback && this._springSystem.getIsIdle()) this.flushCallbacks(); // handle no update case
      }

      getTransitionState() {
        let state = {};
        Object.keys(this._springs).forEach((key) => state[key] = this._springs[key].getCurrentValue());
        return getTransitionState(state);
      }

      render() {
        return <Component {...this.props} {...this.state} setTransitionState={this.setTransitionState.bind(this)} />;
      }

      handleSpringSystemUpdate() {
        this.setState(this.getTransitionState(), () => {
          if (this._springSystem.getIsIdle()) this.flushCallbacks();
        });
      }

      flushCallbacks() {
        let callbacks = this._callbacks;
        this._callbacks = [];
        callbacks.forEach((callback) => {
          if (callback && typeof callback === 'function') callback();
        });
      }
    };
  };
}
