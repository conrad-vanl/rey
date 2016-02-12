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
  //    in a declarative manner (but you don't have to)
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

  // 3. Rey is available as a decorator, simply pass it
  //    a function that creates springs, and the default
  //    transition state:
  @Rey(getSprings, transitionStates.opened)
  class Demo extends React.Component {
    // By default, Rey passes in two props:
    // - `transitionState`: an object with your current spring values
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
            onClick={() => this.props.setTransitionState(transitionStates.closed)}>
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

## Features:

- Allows full-access to Rebound.js's Spring methods
- Ability to define transition states outside of component
- easy integration with React's built-in TransitionGroup (demo to come)
- "chain" springs to another, so they follow each other (see the Chat Heads example)
- create a dynamic list of springs (ex: You have a `PostList` component and want a spring for every `Post`) (see the Chat Heads example)
- and more...

### More docs coming

For now, this gist might give some insight into my thoughts behind the initial API Design and some of the features that are available (or soon to come): https://gist.github.com/conrad-vanl/6a8b5884209ac0625690

<a href="http://differential.com"><img src="http://differential.com/images/logo.svg" width="24"></a> A <a href="http://differential.com">Differential<a/> Hack day Project
