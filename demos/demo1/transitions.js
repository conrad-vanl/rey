export const getSprings = (springs) => ({
  headsX: springs.createSpringGroup(
    (props) => props.heads.map((h, i) => i),
    { stagger: -1 }
  ),
  headsY: springs.createSpringGroup(
    (props) => props.heads.map((h, i) => i),
    { stagger: -1 }
  ),
});

export const transitionStates = {
  default: (springs) => {
    springs.headsX.setCurrentValue(100);
    springs.headsY.setCurrentValue(100);
  },
};
