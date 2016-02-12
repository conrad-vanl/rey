import { SpringConfig } from 'rebound';

/**
 * Handy presets that you can use when creating Springs.
 * todo: add more presets, of course.
 */
export default {
  // All springs use the default Spring settings from Origami
  default: SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG,

  // Like the default preset, but with overshoot clamping enabled, which
  // keeps the spring from oscilating back and forth once it reaches its
  // resting value. Handy for use on properties that shouldn't go past their
  // resting value, such as hwen you are using a Spring to aniamte Opacity.
  noWobble: Object.assign({}, SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG, { overshootClamping: true }),
};
