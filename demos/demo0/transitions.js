// import presets from '../../lib/presets';

export const getSprings = (springs) => ({
  // create a spring with default options, including default tension/friction
  scale: springs.createSpring(),
});

export const transitionStates = {
  default: (springs) => {
    springs.scale.setCurrentValue(100);
  },
  contracted: (springs) => {
    springs.scale.setEndValue(50);
  },
  expanded: (springs) => {
    springs.scale.setEndValue(100);
  },
};
