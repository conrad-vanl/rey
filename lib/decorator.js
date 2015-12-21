import React from 'react';
import SpringSystem from './spring-system';

export default function(getSprings, defaultTransitionState, getTransitionState) {
  if (!getTransitionState || typeof getTransitionState !== 'function') {
    getTransitionState = (transitionState) => ({ transitionState });
  }

  return function(Component) {
    return class Composition extends React.Component {
      constructor(props) {
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
  }
};

