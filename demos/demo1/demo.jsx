import React from 'react';
import decorator from '../../src/decorator';
import { getSprings, transitionStates } from './transitions';

@decorator(getSprings, transitionStates.default)
class Demo extends React.Component {
  render() {
    return (
      <div
        className="demo-0"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
        }}
        onMouseMove={this.update.bind(this)}>
        <h3>Chat Heads</h3>
        <p>Wait for images to load (may take a while), then move your mouse around</p>
        {this.props.heads.map((head, i) => (
          <div
            className="head"
            key={i}
            style={{
              background: `red url(${head})`,
              width: 50,
              height: 50,
              position: 'absolute',
              top: -25,
              left: -25,
              borderRadius: '50%',
              transform: `translate3d(${this.props.transitionState.headsX[i]}px, ${this.props.transitionState.headsY[i]}px, 0)`,
              WebkitTransform: `translate3d(${this.props.transitionState.headsX[i]}px, ${this.props.transitionState.headsY[i]}px, 0)`,
            }}
          />
        ))}
      </div>
    );
  }

  update(e) {
    this.props.setTransitionState((springs) => {
      springs.headsX.setEndValue(e.clientX);
      springs.headsY.setEndValue(e.clientY);
    });
  }
}

Demo.propTypes = {
  transitionState: React.PropTypes.object,
  setTransitionState: React.PropTypes.func,
  heads: React.PropTypes.array,
};

export default Demo;
