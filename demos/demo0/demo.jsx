import React from 'react';
import decorator from '../../src/decorator';
import { getSprings, transitionStates } from './transitions';

@decorator(getSprings, transitionStates.default, transitionState => ({ springs: transitionState }))
class Demo extends React.Component {
  render() {
    return (
      <div className="demo-0">
        <h3>Photo Scale Animation</h3>
        <p>Click and hold down on the image, then release.</p>
        <div
          className="photo-container"
          onMouseDown={this.props.setTransitionState.bind(this, transitionStates.contracted)}
          onMouseUp={this.props.setTransitionState.bind(this, transitionStates.expanded)}>
          <img
            className="photo"
            src="https://source.unsplash.com/random/640x640"
            style={{
              transform: `scale(${this.props.springs.scale / 100})`,
              WebkitTransfrom: `scale(${this.props.springs.scale / 100})`,
            }}/>
        </div>
      </div>
    );
  }
}

Demo.propTypes = {
  springs: React.PropTypes.object,
  setTransitionState: React.PropTypes.func,
};

export default Demo;
