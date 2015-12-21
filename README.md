# Rey

Spring based Transition States for React.js. Powered by Facebook's Rebound.js.

``` javascript
  import Rey from 'rey';

  // 1. Setup the Springs you'll need for your component:
  const getSprings = (springs) => ({
    opacity: springs.createSpring(),
    y: springs.createSpring()
  });

  // 2. Rey allows you to define your transition states
  //    in a declarative manner (but you don't have to))
  const transitionStates = {
    opened: (springs) => {
      springs.opacity.setEndValue(100);
      springs.y.setEndValue(0);
    },
    closed: (springs) => {
      springs.opacity.setEndValue(0);
      springs.y.setEndvalue(100);
    }
  };

  // 3. Rey is availalbe as a decorator, simply pass it
  //    a function that creates springs, and the default
  //    transition state:
  @Rey(getSprings, transitionStates.opened)
  class Demo extends React.Component {
    // By default, Rey passes in two props:
    // - 'transitionState': an object with your current spring values
    // - `setTransitionState`: a setter function to update the transition state
    render() {
      return (
        <div style={{
          top: this.props.transitionState.y + '%',
          opacity: this.props.transitionState.opacity / 100
        }}>
          Cool demo bro!
          <button
            type="button"
            onClick={this.setTransitionState(transitionStates.closed)}}>
              Close
          </button>
        </div>
      );
    }
  };
```

## Demos (more coming):

- Simple Photo Scale animation: http://convan.me/rey/demos/demo0/
- Chat Heads: http://convan.me/rey/demos/demo1/

### More docs coming